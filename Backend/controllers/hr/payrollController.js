import User from "../../models/User.js";
import { Op } from "sequelize";
import {
  EmployeeSalaryStructure,
  EmployeeSalaryComponent,
  SalaryComponent,
  PayrollRun,
  SalarySlip,
  EmployeeProfile,
  AttendanceLog,
} from "../../models/hr/index.js";
import {
  assertSelfOrAdmin,
  createNotification,
  isAdmin,
  paginate,
  writeAudit,
} from "../../utils/hr/helpers.js";
import { generateSalarySlipPdf, monthName } from "../../utils/hr/salarySlipPdf.js";
import { uploadToS3, getSignedUrl } from "../../utils/s3Config.js";

export const upsertEmployeeProfile = async (req, res) => {
  try {
    const userId = req.params.userId || req.userId;
    assertSelfOrAdmin(req, userId);
    if (!isAdmin(req) && String(userId) !== String(req.userId)) {
      return res.status(403).json({ message: "Access forbidden" });
    }

    const [profile] = await EmployeeProfile.findOrCreate({
      where: { user_id: userId },
      defaults: { user_id: userId },
    });
    await profile.update(req.body);
    res.json(profile);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

export const getEmployeeProfile = async (req, res) => {
  try {
    const userId = req.params.userId || req.userId;
    assertSelfOrAdmin(req, userId);
    const profile = await EmployeeProfile.findOne({ where: { user_id: userId } });
    const user = await User.findOne({
      where: { user_id: userId },
      attributes: ["user_id", "name", "email", "username", "department", "designation", "mobile_number", "status"],
    });
    res.json({ user, profile });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

export const listEmployeeProfiles = async (req, res) => {
  try {
    const { page, limit, offset } = paginate(req.query);
    const { rows, count } = await User.findAndCountAll({
      attributes: ["user_id", "name", "email", "department", "designation", "status", "role"],
      order: [["name", "ASC"]],
      limit,
      offset,
    });
    const profiles = await EmployeeProfile.findAll({
      where: { user_id: rows.map((u) => u.user_id) },
    });
    const byUser = Object.fromEntries(profiles.map((p) => [p.user_id, p]));
    res.json({
      data: rows.map((u) => ({ ...u.get({ plain: true }), profile: byUser[u.user_id] || null })),
      pagination: {
        page,
        limit,
        totalRecords: count,
        totalPages: Math.ceil(count / limit) || 1,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createSalaryStructure = async (req, res) => {
  try {
    const { user_id, effective_from, basic_salary, components = [], currency } = req.body;
    if (!user_id || !effective_from) {
      return res.status(400).json({ message: "user_id and effective_from are required" });
    }

    const structure = await EmployeeSalaryStructure.create({
      user_id,
      effective_from,
      basic_salary: basic_salary || 0,
      currency: currency || "INR",
      status: "active",
    });

    if (components.length) {
      await EmployeeSalaryComponent.bulkCreate(
        components.map((c) => ({
          structure_id: structure.id,
          component_id: c.component_id,
          amount: c.amount || 0,
        }))
      );
    }

    await writeAudit({
      actor_id: req.userId,
      action: "create",
      entity_type: "salary_structure",
      entity_id: structure.id,
    });

    const full = await EmployeeSalaryStructure.findByPk(structure.id, {
      include: [
        {
          model: EmployeeSalaryComponent,
          as: "components",
          include: [{ model: SalaryComponent, as: "component" }],
        },
      ],
    });
    res.status(201).json(full);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const listSalaryStructures = async (req, res) => {
  try {
    const where = {};
    if (!isAdmin(req)) where.user_id = req.userId;
    else if (req.query.userId) where.user_id = req.query.userId;

    const { page, limit, offset } = paginate(req.query);
    const usePaging = req.query.page != null || req.query.limit != null;

    const include = [
      { model: User, as: "employee", attributes: ["user_id", "name", "email"] },
      {
        model: EmployeeSalaryComponent,
        as: "components",
        include: [{ model: SalaryComponent, as: "component" }],
      },
    ];

    if (usePaging) {
      const { rows, count } = await EmployeeSalaryStructure.findAndCountAll({
        where,
        include,
        order: [["effective_from", "DESC"]],
        limit,
        offset,
        distinct: true,
      });
      return res.json({
        data: rows,
        pagination: {
          page,
          limit,
          totalRecords: count,
          totalPages: Math.ceil(count / limit) || 0,
        },
      });
    }

    const rows = await EmployeeSalaryStructure.findAll({
      where,
      include,
      order: [["effective_from", "DESC"]],
    });
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const computePay = (structure, componentRows) => {
  let earnings = Number(structure.basic_salary) || 0;
  let deductions = 0;
  const breakdown = {
    earnings: [{ code: "BASIC", name: "Basic Salary", amount: earnings }],
    deductions: [],
  };

  for (const row of componentRows) {
    const comp = row.component;
    if (!comp) continue;
    let amount = Number(row.amount) || 0;
    if (comp.is_percentage) {
      amount = (Number(structure.basic_salary) * amount) / 100;
    }
    amount = Math.round(amount * 100) / 100;
    if (comp.type === "deduction") {
      deductions += amount;
      breakdown.deductions.push({ code: comp.code, name: comp.name, amount });
    } else {
      earnings += amount;
      breakdown.earnings.push({ code: comp.code, name: comp.name, amount });
    }
  }

  return {
    gross_earnings: Math.round(earnings * 100) / 100,
    total_deductions: Math.round(deductions * 100) / 100,
    net_pay: Math.round((earnings - deductions) * 100) / 100,
    breakdown,
  };
};

export const runPayroll = async (req, res) => {
  try {
    const year = Number(req.body.year);
    const month = Number(req.body.month);
    if (!year || !month || month < 1 || month > 12) {
      return res.status(400).json({ message: "Valid year and month are required" });
    }

    let run = await PayrollRun.findOne({ where: { period_year: year, period_month: month } });
    if (run?.status === "locked") {
      return res.status(400).json({ message: "Payroll for this period is locked" });
    }
    if (!run) {
      run = await PayrollRun.create({
        period_year: year,
        period_month: month,
        status: "draft",
      });
    }

    await SalarySlip.destroy({ where: { payroll_run_id: run.id } });

    const structures = await EmployeeSalaryStructure.findAll({
      where: { status: "active" },
      include: [
        {
          model: EmployeeSalaryComponent,
          as: "components",
          include: [{ model: SalaryComponent, as: "component" }],
        },
        {
          model: User,
          as: "employee",
          attributes: ["user_id", "name", "email", "department", "designation", "date_joined"],
        },
      ],
    });

    // latest structure per user
    const latestByUser = new Map();
    for (const s of structures) {
      const existing = latestByUser.get(s.user_id);
      if (!existing || new Date(s.effective_from) > new Date(existing.effective_from)) {
        latestByUser.set(s.user_id, s);
      }
    }

    const m = String(month).padStart(2, "0");
    const lastDay = new Date(year, month, 0).getDate();
    const from = `${year}-${m}-01`;
    const to = `${year}-${m}-${lastDay}`;

    const slips = [];
    for (const structure of latestByUser.values()) {
      const pay = computePay(structure, structure.components || []);
      const employee = structure.employee;

      const workedDays = await AttendanceLog.count({
        where: {
          user_id: structure.user_id,
          work_date: { [Op.between]: [from, to] },
          check_in_at: { [Op.ne]: null },
        },
      });

      const pdfBuffer = await generateSalarySlipPdf({
        employee,
        year,
        month,
        pay,
        workedDays,
        dateOfJoining: employee?.date_joined,
      });

      const fakeFile = {
        originalname: `payslip-${structure.user_id}-${monthName(month)}-${year}.pdf`,
        mimetype: "application/pdf",
        buffer: pdfBuffer,
      };
      const pdfUrl = await uploadToS3(fakeFile, "hr/salary-slips");

      const slip = await SalarySlip.create({
        payroll_run_id: run.id,
        user_id: structure.user_id,
        period_year: year,
        period_month: month,
        ...pay,
        storage_key: pdfUrl,
        pdf_url: pdfUrl,
      });

      await createNotification({
        user_id: structure.user_id,
        title: "Salary slip generated",
        message: `Your payslip for ${monthName(month)} ${year} is ready.`,
        type: "payroll",
        entity_type: "salary_slip",
        entity_id: slip.id,
      });

      slips.push(slip);
    }

    await run.update({
      status: "processed",
      processed_by: req.userId,
      processed_at: new Date(),
    });

    await writeAudit({
      actor_id: req.userId,
      action: "run_payroll",
      entity_type: "payroll_run",
      entity_id: run.id,
      meta: { year, month, slips: slips.length },
    });

    res.json({ run, slipsCount: slips.length, slips });
  } catch (error) {
    console.error("Payroll error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const listSalarySlips = async (req, res) => {
  try {
    const { page, limit, offset } = paginate(req.query);
    const where = {};
    if (!isAdmin(req)) where.user_id = req.userId;
    else if (req.query.userId) where.user_id = req.query.userId;
    if (req.query.year) where.period_year = Number(req.query.year);
    if (req.query.month) where.period_month = Number(req.query.month);

    const { rows, count } = await SalarySlip.findAndCountAll({
      where,
      include: [{ model: User, as: "employee", attributes: ["user_id", "name", "email"] }],
      order: [["period_year", "DESC"], ["period_month", "DESC"]],
      limit,
      offset,
    });

    res.json({
      data: rows,
      pagination: {
        page,
        limit,
        totalRecords: count,
        totalPages: Math.ceil(count / limit) || 1,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSalarySlip = async (req, res) => {
  try {
    const slip = await SalarySlip.findOne({
      where: { uuid: req.params.uuid },
      include: [
        {
          model: User,
          as: "employee",
          attributes: ["user_id", "name", "email", "department", "designation", "date_joined"],
        },
      ],
    });
    if (!slip) return res.status(404).json({ message: "Slip not found" });
    assertSelfOrAdmin(req, slip.user_id);
    res.json(slip);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

/** Resolve viewable/downloadable URL for a payslip (admin or owner). */
export const getSalarySlipFile = async (req, res) => {
  try {
    const slip = await SalarySlip.findOne({ where: { uuid: req.params.uuid } });
    if (!slip) return res.status(404).json({ message: "Slip not found" });
    assertSelfOrAdmin(req, slip.user_id);

    let url = slip.pdf_url || slip.storage_key;
    if (url && !String(url).startsWith("http") && !String(url).startsWith("/")) {
      url = await getSignedUrl(url);
    }

    res.json({
      url,
      title: `Payslip - ${monthName(slip.period_month)} ${slip.period_year}`,
      mime_type: "application/pdf",
      period_month: slip.period_month,
      period_year: slip.period_year,
      net_pay: slip.net_pay,
      breakdown: slip.breakdown,
    });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

export const listPayrollRuns = async (req, res) => {
  try {
    const { page, limit, offset } = paginate(req.query);
    const usePaging = req.query.page != null || req.query.limit != null;

    if (usePaging) {
      const { rows, count } = await PayrollRun.findAndCountAll({
        order: [["period_year", "DESC"], ["period_month", "DESC"]],
        limit,
        offset,
      });
      return res.json({
        data: rows,
        pagination: {
          page,
          limit,
          totalRecords: count,
          totalPages: Math.ceil(count / limit) || 0,
        },
      });
    }

    const rows = await PayrollRun.findAll({
      order: [["period_year", "DESC"], ["period_month", "DESC"]],
    });
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

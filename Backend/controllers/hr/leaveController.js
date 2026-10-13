import { Op } from "sequelize";
import User from "../../models/User.js";
import {
  LeaveType,
  LeavePolicy,
  LeaveBalance,
  LeaveRequest,
} from "../../models/hr/index.js";
import {
  assertSelfOrAdmin,
  createNotification,
  daysInclusive,
  isAdmin,
  paginate,
  writeAudit,
} from "../../utils/hr/helpers.js";

const ensureBalance = async (userId, leaveTypeId, year) => {
  let balance = await LeaveBalance.findOne({
    where: { user_id: userId, leave_type_id: leaveTypeId, year },
  });
  if (balance) return balance;

  const policy = await LeavePolicy.findOne({
    where: { leave_type_id: leaveTypeId, is_default: true },
  });
  balance = await LeaveBalance.create({
    user_id: userId,
    leave_type_id: leaveTypeId,
    year,
    allocated: policy?.annual_allocation || 0,
    used: 0,
    pending: 0,
  });
  return balance;
};

export const listMyBalances = async (req, res) => {
  try {
    const userId = req.query.userId && isAdmin(req) ? req.query.userId : req.userId;
    assertSelfOrAdmin(req, userId);
    const year = Number(req.query.year) || new Date().getFullYear();

    const types = await LeaveType.findAll({ where: { status: "active" } });
    const balances = [];
    for (const type of types) {
      const bal = await ensureBalance(userId, type.id, year);
      balances.push({
        ...bal.get({ plain: true }),
        leaveType: type,
        available: Number(bal.allocated) - Number(bal.used) - Number(bal.pending),
      });
    }
    res.json(balances);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

export const applyLeave = async (req, res) => {
  try {
    const { leave_type_id, start_date, end_date, reason } = req.body;
    if (!leave_type_id || !start_date || !end_date) {
      return res.status(400).json({ message: "leave_type_id, start_date, end_date are required" });
    }

    const days = daysInclusive(start_date, end_date);
    if (days <= 0) return res.status(400).json({ message: "Invalid date range" });

    const year = new Date(start_date).getFullYear();
    const balance = await ensureBalance(req.userId, leave_type_id, year);
    const available =
      Number(balance.allocated) - Number(balance.used) - Number(balance.pending);
    if (days > available) {
      return res.status(400).json({ message: `Insufficient leave balance. Available: ${available}` });
    }

    const request = await LeaveRequest.create({
      user_id: req.userId,
      leave_type_id,
      start_date,
      end_date,
      days,
      reason,
      status: "pending",
    });

    await balance.update({ pending: Number(balance.pending) + days });

    const admins = await User.findAll({ where: { role: { [Op.like]: "admin" } } });
    await Promise.all(
      admins.map((admin) =>
        createNotification({
          user_id: admin.user_id,
          title: "New leave request",
          message: `${req.name || req.userId} requested ${days} day(s) leave`,
          type: "leave",
          entity_type: "leave_request",
          entity_id: request.id,
        })
      )
    );

    await writeAudit({
      actor_id: req.userId,
      action: "apply",
      entity_type: "leave_request",
      entity_id: request.id,
    });

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const listLeaveRequests = async (req, res) => {
  try {
    const { page, limit, offset } = paginate(req.query);
    const where = {};
    if (isAdmin(req)) {
      if (req.query.userId) where.user_id = req.query.userId;
      if (req.query.status) where.status = req.query.status;
    } else {
      where.user_id = req.userId;
      if (req.query.status) where.status = req.query.status;
    }

    const { rows, count } = await LeaveRequest.findAndCountAll({
      where,
      include: [
        { model: LeaveType, as: "leaveType" },
        { model: User, as: "employee", attributes: ["user_id", "name", "email"] },
      ],
      order: [["createdAt", "DESC"]],
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

export const reviewLeave = async (req, res) => {
  try {
    const { status, review_note } = req.body;
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "status must be approved or rejected" });
    }

    const request = await LeaveRequest.findByPk(req.params.id);
    if (!request) return res.status(404).json({ message: "Leave request not found" });
    if (request.status !== "pending") {
      return res.status(400).json({ message: "Only pending requests can be reviewed" });
    }

    const year = new Date(request.start_date).getFullYear();
    const balance = await ensureBalance(request.user_id, request.leave_type_id, year);
    const days = Number(request.days);

    if (status === "approved") {
      await balance.update({
        pending: Math.max(0, Number(balance.pending) - days),
        used: Number(balance.used) + days,
      });
    } else {
      await balance.update({
        pending: Math.max(0, Number(balance.pending) - days),
      });
    }

    await request.update({
      status,
      reviewed_by: req.userId,
      reviewed_at: new Date(),
      review_note: review_note || null,
    });

    await createNotification({
      user_id: request.user_id,
      title: `Leave ${status}`,
      message: `Your leave request (${request.start_date} to ${request.end_date}) was ${status}.`,
      type: "leave",
      entity_type: "leave_request",
      entity_id: request.id,
    });

    await writeAudit({
      actor_id: req.userId,
      action: status,
      entity_type: "leave_request",
      entity_id: request.id,
      meta: { review_note },
    });

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const cancelLeave = async (req, res) => {
  try {
    const request = await LeaveRequest.findByPk(req.params.id);
    if (!request) return res.status(404).json({ message: "Not found" });
    assertSelfOrAdmin(req, request.user_id);
    if (request.status !== "pending") {
      return res.status(400).json({ message: "Only pending requests can be cancelled" });
    }

    const year = new Date(request.start_date).getFullYear();
    const balance = await ensureBalance(request.user_id, request.leave_type_id, year);
    await balance.update({
      pending: Math.max(0, Number(balance.pending) - Number(request.days)),
    });
    await request.update({ status: "cancelled" });

    res.json(request);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

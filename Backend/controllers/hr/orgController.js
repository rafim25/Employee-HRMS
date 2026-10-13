import {
  OrgSetting,
  AttendancePolicy,
  WorkingDayConfig,
  AuthorizedLocation,
  Holiday,
  SalaryComponent,
  LeaveType,
  LeavePolicy,
} from "../../models/hr/index.js";
import { writeAudit } from "../../utils/hr/helpers.js";

const crudList = (Model) => async (req, res) => {
  try {
    const rows = await Model.findAll({ order: [["id", "DESC"]] });
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const crudCreate = (Model, entity) => async (req, res) => {
  try {
    const row = await Model.create(req.body);
    await writeAudit({
      actor_id: req.userId,
      action: "create",
      entity_type: entity,
      entity_id: row.id,
      meta: req.body,
    });
    res.status(201).json(row);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const crudUpdate = (Model, entity) => async (req, res) => {
  try {
    const row = await Model.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: "Not found" });
    await row.update(req.body);
    await writeAudit({
      actor_id: req.userId,
      action: "update",
      entity_type: entity,
      entity_id: row.id,
      meta: req.body,
    });
    res.json(row);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const crudDelete = (Model, entity) => async (req, res) => {
  try {
    const row = await Model.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: "Not found" });
    await row.destroy();
    await writeAudit({
      actor_id: req.userId,
      action: "delete",
      entity_type: entity,
      entity_id: req.params.id,
    });
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const listOrgSettings = crudList(OrgSetting);
export const upsertOrgSetting = async (req, res) => {
  try {
    const { key, value, description } = req.body;
    if (!key) return res.status(400).json({ message: "key is required" });
    const [row] = await OrgSetting.findOrCreate({
      where: { key },
      defaults: { value, description },
    });
    if (row) await row.update({ value, description });
    await writeAudit({
      actor_id: req.userId,
      action: "upsert",
      entity_type: "org_setting",
      entity_id: key,
      meta: { value },
    });
    res.json(row);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const listAttendancePolicies = crudList(AttendancePolicy);
export const createAttendancePolicy = crudCreate(AttendancePolicy, "attendance_policy");
export const updateAttendancePolicy = crudUpdate(AttendancePolicy, "attendance_policy");
export const deleteAttendancePolicy = crudDelete(AttendancePolicy, "attendance_policy");

export const listWorkingDays = crudList(WorkingDayConfig);
export const createWorkingDay = crudCreate(WorkingDayConfig, "working_day");
export const updateWorkingDay = crudUpdate(WorkingDayConfig, "working_day");
export const deleteWorkingDay = crudDelete(WorkingDayConfig, "working_day");

export const listAuthorizedLocations = crudList(AuthorizedLocation);
export const createAuthorizedLocation = crudCreate(AuthorizedLocation, "authorized_location");
export const updateAuthorizedLocation = crudUpdate(AuthorizedLocation, "authorized_location");
export const deleteAuthorizedLocation = crudDelete(AuthorizedLocation, "authorized_location");

export const listHolidays = async (req, res) => {
  try {
    const where = {};
    if (req.query.year) {
      const year = Number(req.query.year);
      const { Op } = await import("sequelize");
      where.date = {
        [Op.between]: [`${year}-01-01`, `${year}-12-31`],
      };
    }
    const rows = await Holiday.findAll({ where, order: [["date", "ASC"]] });
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const createHoliday = crudCreate(Holiday, "holiday");
export const updateHoliday = crudUpdate(Holiday, "holiday");
export const deleteHoliday = crudDelete(Holiday, "holiday");

export const listSalaryComponents = crudList(SalaryComponent);
export const createSalaryComponent = crudCreate(SalaryComponent, "salary_component");
export const updateSalaryComponent = crudUpdate(SalaryComponent, "salary_component");
export const deleteSalaryComponent = crudDelete(SalaryComponent, "salary_component");

export const listLeaveTypes = crudList(LeaveType);
export const createLeaveType = crudCreate(LeaveType, "leave_type");
export const updateLeaveType = crudUpdate(LeaveType, "leave_type");
export const deleteLeaveType = crudDelete(LeaveType, "leave_type");

export const listLeavePolicies = async (req, res) => {
  try {
    const rows = await LeavePolicy.findAll({
      include: [{ model: LeaveType, as: "leaveType" }],
      order: [["id", "DESC"]],
    });
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const createLeavePolicy = crudCreate(LeavePolicy, "leave_policy");
export const updateLeavePolicy = crudUpdate(LeavePolicy, "leave_policy");
export const deleteLeavePolicy = crudDelete(LeavePolicy, "leave_policy");

export const getDefaultAttendancePolicy = async (req, res) => {
  try {
    const policy =
      (await AttendancePolicy.findOne({ where: { is_default: true, status: "active" } })) ||
      (await AttendancePolicy.findOne({ where: { status: "active" }, order: [["id", "ASC"]] }));
    res.json(policy || null);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

import { Sequelize } from "sequelize";
import db from "../../config/Database.js";

const { DataTypes } = Sequelize;

const common = {
  freezeTableName: true,
  timestamps: true,
};

export const OrgSetting = db.define(
  "org_settings",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    key: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    value: { type: DataTypes.JSON, allowNull: true },
    description: { type: DataTypes.STRING, allowNull: true },
  },
  common
);

export const AttendancePolicy = db.define(
  "attendance_policies",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(120), allowNull: false },
    work_start: { type: DataTypes.STRING(10), allowNull: false, defaultValue: "09:00" },
    work_end: { type: DataTypes.STRING(10), allowNull: false, defaultValue: "18:00" },
    grace_minutes: { type: DataTypes.INTEGER, defaultValue: 15 },
    require_location: { type: DataTypes.BOOLEAN, defaultValue: false },
    weekly_offs: { type: DataTypes.JSON, defaultValue: [0, 6] }, // Sun=0 Sat=6
    is_default: { type: DataTypes.BOOLEAN, defaultValue: false },
    status: { type: DataTypes.STRING(20), defaultValue: "active" },
  },
  common
);

export const WorkingDayConfig = db.define(
  "working_day_configs",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(120), allowNull: false },
    days: { type: DataTypes.JSON, defaultValue: [1, 2, 3, 4, 5] }, // Mon-Fri
    hours_per_day: { type: DataTypes.DECIMAL(4, 2), defaultValue: 8 },
    is_default: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  common
);

export const AuthorizedLocation = db.define(
  "authorized_locations",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(150), allowNull: false },
    address: { type: DataTypes.TEXT, allowNull: true },
    latitude: { type: DataTypes.DECIMAL(10, 7), allowNull: false },
    longitude: { type: DataTypes.DECIMAL(10, 7), allowNull: false },
    radius_meters: { type: DataTypes.INTEGER, defaultValue: 200 },
    status: { type: DataTypes.STRING(20), defaultValue: "active" },
  },
  common
);

export const Holiday = db.define(
  "holidays",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(150), allowNull: false },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    type: { type: DataTypes.STRING(40), defaultValue: "public" },
    description: { type: DataTypes.TEXT, allowNull: true },
    is_optional: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  common
);

export const LeaveType = db.define(
  "leave_types",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    code: { type: DataTypes.STRING(20), allowNull: false, unique: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    paid: { type: DataTypes.BOOLEAN, defaultValue: true },
    status: { type: DataTypes.STRING(20), defaultValue: "active" },
  },
  common
);

export const LeavePolicy = db.define(
  "leave_policies",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    leave_type_id: { type: DataTypes.INTEGER, allowNull: false },
    annual_allocation: { type: DataTypes.DECIMAL(6, 2), allowNull: false, defaultValue: 0 },
    max_consecutive: { type: DataTypes.INTEGER, allowNull: true },
    carry_forward: { type: DataTypes.BOOLEAN, defaultValue: false },
    requires_approval: { type: DataTypes.BOOLEAN, defaultValue: true },
    is_default: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  common
);

export const LeaveBalance = db.define(
  "leave_balances",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.STRING, allowNull: false },
    leave_type_id: { type: DataTypes.INTEGER, allowNull: false },
    year: { type: DataTypes.INTEGER, allowNull: false },
    allocated: { type: DataTypes.DECIMAL(6, 2), defaultValue: 0 },
    used: { type: DataTypes.DECIMAL(6, 2), defaultValue: 0 },
    pending: { type: DataTypes.DECIMAL(6, 2), defaultValue: 0 },
  },
  {
    ...common,
    indexes: [{ unique: true, fields: ["user_id", "leave_type_id", "year"], name: "leave_balances_unique" }],
  }
);

export const LeaveRequest = db.define(
  "leave_requests",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    uuid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
    user_id: { type: DataTypes.STRING, allowNull: false },
    leave_type_id: { type: DataTypes.INTEGER, allowNull: false },
    start_date: { type: DataTypes.DATEONLY, allowNull: false },
    end_date: { type: DataTypes.DATEONLY, allowNull: false },
    days: { type: DataTypes.DECIMAL(6, 2), allowNull: false },
    reason: { type: DataTypes.TEXT, allowNull: true },
    status: { type: DataTypes.STRING(30), defaultValue: "pending" }, // pending|approved|rejected|cancelled
    reviewed_by: { type: DataTypes.STRING, allowNull: true },
    reviewed_at: { type: DataTypes.DATE, allowNull: true },
    review_note: { type: DataTypes.TEXT, allowNull: true },
  },
  common
);

export const AttendanceLog = db.define(
  "attendance_logs",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.STRING, allowNull: false },
    work_date: { type: DataTypes.DATEONLY, allowNull: false },
    check_in_at: { type: DataTypes.DATE, allowNull: true },
    check_out_at: { type: DataTypes.DATE, allowNull: true },
    check_in_lat: { type: DataTypes.DECIMAL(10, 7), allowNull: true },
    check_in_lng: { type: DataTypes.DECIMAL(10, 7), allowNull: true },
    check_out_lat: { type: DataTypes.DECIMAL(10, 7), allowNull: true },
    check_out_lng: { type: DataTypes.DECIMAL(10, 7), allowNull: true },
    location_id: { type: DataTypes.INTEGER, allowNull: true },
    working_hours: { type: DataTypes.DECIMAL(6, 2), allowNull: true },
    status: { type: DataTypes.STRING(30), defaultValue: "open" }, // open|closed|absent
    notes: { type: DataTypes.TEXT, allowNull: true },
  },
  {
    ...common,
    indexes: [{ unique: true, fields: ["user_id", "work_date"], name: "attendance_logs_user_date" }],
  }
);

export const SalaryComponent = db.define(
  "salary_components",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    code: { type: DataTypes.STRING(40), allowNull: false, unique: true },
    name: { type: DataTypes.STRING(120), allowNull: false },
    type: { type: DataTypes.STRING(20), allowNull: false }, // earning|deduction
    is_percentage: { type: DataTypes.BOOLEAN, defaultValue: false },
    default_value: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
    status: { type: DataTypes.STRING(20), defaultValue: "active" },
  },
  common
);

export const EmployeeProfile = db.define(
  "employee_profiles",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.STRING, allowNull: false, unique: true },
    bank_name: { type: DataTypes.STRING(120), allowNull: true },
    bank_account: { type: DataTypes.STRING(60), allowNull: true },
    ifsc: { type: DataTypes.STRING(20), allowNull: true },
    pan: { type: DataTypes.STRING(20), allowNull: true },
    aadhaar: { type: DataTypes.STRING(20), allowNull: true },
    pf_number: { type: DataTypes.STRING(40), allowNull: true },
    esi_number: { type: DataTypes.STRING(40), allowNull: true },
    emergency_contact: { type: DataTypes.STRING(20), allowNull: true },
    notes: { type: DataTypes.TEXT, allowNull: true },
  },
  common
);

export const EmployeeSalaryStructure = db.define(
  "employee_salary_structures",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.STRING, allowNull: false },
    effective_from: { type: DataTypes.DATEONLY, allowNull: false },
    basic_salary: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
    currency: { type: DataTypes.STRING(10), defaultValue: "INR" },
    status: { type: DataTypes.STRING(20), defaultValue: "active" },
  },
  common
);

export const EmployeeSalaryComponent = db.define(
  "employee_salary_components",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    structure_id: { type: DataTypes.INTEGER, allowNull: false },
    component_id: { type: DataTypes.INTEGER, allowNull: false },
    amount: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
  },
  common
);

export const PayrollRun = db.define(
  "payroll_runs",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    period_year: { type: DataTypes.INTEGER, allowNull: false },
    period_month: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.STRING(30), defaultValue: "draft" }, // draft|processed|locked
    processed_by: { type: DataTypes.STRING, allowNull: true },
    processed_at: { type: DataTypes.DATE, allowNull: true },
    notes: { type: DataTypes.TEXT, allowNull: true },
  },
  {
    ...common,
    indexes: [{ unique: true, fields: ["period_year", "period_month"], name: "payroll_runs_period" }],
  }
);

export const SalarySlip = db.define(
  "salary_slips",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    uuid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
    payroll_run_id: { type: DataTypes.INTEGER, allowNull: false },
    user_id: { type: DataTypes.STRING, allowNull: false },
    period_year: { type: DataTypes.INTEGER, allowNull: false },
    period_month: { type: DataTypes.INTEGER, allowNull: false },
    gross_earnings: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
    total_deductions: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
    net_pay: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
    breakdown: { type: DataTypes.JSON, allowNull: true },
    storage_key: { type: DataTypes.STRING, allowNull: true },
    pdf_url: { type: DataTypes.STRING, allowNull: true },
  },
  common
);

export const EmployeeDocument = db.define(
  "employee_documents",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    uuid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
    user_id: { type: DataTypes.STRING, allowNull: false },
    doc_type: { type: DataTypes.STRING(40), allowNull: false }, // aadhaar|pan|other
    title: { type: DataTypes.STRING(150), allowNull: false },
    storage_key: { type: DataTypes.STRING, allowNull: false },
    file_url: { type: DataTypes.STRING, allowNull: true },
    mime_type: { type: DataTypes.STRING(80), allowNull: true },
    status: { type: DataTypes.STRING(30), defaultValue: "uploaded" },
    uploaded_by: { type: DataTypes.STRING, allowNull: true },
  },
  common
);

export const Notification = db.define(
  "notifications",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.STRING, allowNull: false },
    title: { type: DataTypes.STRING(200), allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
    type: { type: DataTypes.STRING(40), defaultValue: "info" },
    entity_type: { type: DataTypes.STRING(40), allowNull: true },
    entity_id: { type: DataTypes.STRING(60), allowNull: true },
    is_read: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  common
);

export const AuditLog = db.define(
  "audit_logs",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    actor_id: { type: DataTypes.STRING, allowNull: true },
    action: { type: DataTypes.STRING(80), allowNull: false },
    entity_type: { type: DataTypes.STRING(40), allowNull: false },
    entity_id: { type: DataTypes.STRING(60), allowNull: true },
    meta: { type: DataTypes.JSON, allowNull: true },
  },
  common
);

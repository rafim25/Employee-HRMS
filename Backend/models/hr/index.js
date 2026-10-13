import User from "../User.js";
import {
  OrgSetting,
  AttendancePolicy,
  WorkingDayConfig,
  AuthorizedLocation,
  Holiday,
  LeaveType,
  LeavePolicy,
  LeaveBalance,
  LeaveRequest,
  AttendanceLog,
  SalaryComponent,
  EmployeeProfile,
  EmployeeSalaryStructure,
  EmployeeSalaryComponent,
  PayrollRun,
  SalarySlip,
  EmployeeDocument,
  Notification,
  AuditLog,
} from "./definitions.js";

LeavePolicy.belongsTo(LeaveType, { foreignKey: "leave_type_id", as: "leaveType" });
LeaveType.hasMany(LeavePolicy, { foreignKey: "leave_type_id", as: "policies" });

LeaveBalance.belongsTo(LeaveType, { foreignKey: "leave_type_id", as: "leaveType" });
LeaveBalance.belongsTo(User, { foreignKey: "user_id", as: "employee" });

LeaveRequest.belongsTo(LeaveType, { foreignKey: "leave_type_id", as: "leaveType" });
LeaveRequest.belongsTo(User, { foreignKey: "user_id", as: "employee" });

AttendanceLog.belongsTo(User, { foreignKey: "user_id", as: "employee" });
AttendanceLog.belongsTo(AuthorizedLocation, { foreignKey: "location_id", as: "location" });

EmployeeProfile.belongsTo(User, { foreignKey: "user_id", as: "employee" });

EmployeeSalaryStructure.belongsTo(User, { foreignKey: "user_id", as: "employee" });
EmployeeSalaryStructure.hasMany(EmployeeSalaryComponent, {
  foreignKey: "structure_id",
  as: "components",
  onDelete: "CASCADE",
});
EmployeeSalaryComponent.belongsTo(EmployeeSalaryStructure, {
  foreignKey: "structure_id",
  as: "structure",
});
EmployeeSalaryComponent.belongsTo(SalaryComponent, {
  foreignKey: "component_id",
  as: "component",
});

PayrollRun.hasMany(SalarySlip, { foreignKey: "payroll_run_id", as: "slips", onDelete: "CASCADE" });
SalarySlip.belongsTo(PayrollRun, { foreignKey: "payroll_run_id", as: "payrollRun" });
SalarySlip.belongsTo(User, { foreignKey: "user_id", as: "employee" });

EmployeeDocument.belongsTo(User, { foreignKey: "user_id", as: "employee" });
Notification.belongsTo(User, { foreignKey: "user_id", as: "employee" });

export {
  OrgSetting,
  AttendancePolicy,
  WorkingDayConfig,
  AuthorizedLocation,
  Holiday,
  LeaveType,
  LeavePolicy,
  LeaveBalance,
  LeaveRequest,
  AttendanceLog,
  SalaryComponent,
  EmployeeProfile,
  EmployeeSalaryStructure,
  EmployeeSalaryComponent,
  PayrollRun,
  SalarySlip,
  EmployeeDocument,
  Notification,
  AuditLog,
};

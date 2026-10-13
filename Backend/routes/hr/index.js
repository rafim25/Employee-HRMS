import express from "express";
import multer from "multer";
import {
  verify_User as verifyUser,
  admin_Only as adminOnly,
} from "../../middleware/AuthUser.js";
import * as org from "../../controllers/hr/orgController.js";
import * as attendance from "../../controllers/hr/attendanceController.js";
import * as leave from "../../controllers/hr/leaveController.js";
import * as payroll from "../../controllers/hr/payrollController.js";
// getSalarySlipFile exported from payrollController
import * as documents from "../../controllers/hr/documentController.js";
import * as notifications from "../../controllers/hr/notificationController.js";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.use(verifyUser);

// Org / settings (admin write, all can read holidays/policy)
router.get("/org-settings", adminOnly, org.listOrgSettings);
router.post("/org-settings", adminOnly, org.upsertOrgSetting);

router.get("/attendance-policies", org.listAttendancePolicies);
router.get("/attendance-policies/default", org.getDefaultAttendancePolicy);
router.post("/attendance-policies", adminOnly, org.createAttendancePolicy);
router.put("/attendance-policies/:id", adminOnly, org.updateAttendancePolicy);
router.delete("/attendance-policies/:id", adminOnly, org.deleteAttendancePolicy);

router.get("/working-days", org.listWorkingDays);
router.post("/working-days", adminOnly, org.createWorkingDay);
router.put("/working-days/:id", adminOnly, org.updateWorkingDay);
router.delete("/working-days/:id", adminOnly, org.deleteWorkingDay);

router.get("/authorized-locations", org.listAuthorizedLocations);
router.post("/authorized-locations", adminOnly, org.createAuthorizedLocation);
router.put("/authorized-locations/:id", adminOnly, org.updateAuthorizedLocation);
router.delete("/authorized-locations/:id", adminOnly, org.deleteAuthorizedLocation);

router.get("/holidays", org.listHolidays);
router.post("/holidays", adminOnly, org.createHoliday);
router.put("/holidays/:id", adminOnly, org.updateHoliday);
router.delete("/holidays/:id", adminOnly, org.deleteHoliday);

router.get("/salary-components", org.listSalaryComponents);
router.post("/salary-components", adminOnly, org.createSalaryComponent);
router.put("/salary-components/:id", adminOnly, org.updateSalaryComponent);
router.delete("/salary-components/:id", adminOnly, org.deleteSalaryComponent);

router.get("/leave-types", org.listLeaveTypes);
router.post("/leave-types", adminOnly, org.createLeaveType);
router.put("/leave-types/:id", adminOnly, org.updateLeaveType);
router.delete("/leave-types/:id", adminOnly, org.deleteLeaveType);

router.get("/leave-policies", org.listLeavePolicies);
router.post("/leave-policies", adminOnly, org.createLeavePolicy);
router.put("/leave-policies/:id", adminOnly, org.updateLeavePolicy);
router.delete("/leave-policies/:id", adminOnly, org.deleteLeavePolicy);

// Attendance
router.post("/attendance/check-in", attendance.checkIn);
router.post("/attendance/check-out", attendance.checkOut);
router.get("/attendance/today", attendance.getTodayStatus);
router.get("/attendance", attendance.listAttendance);

// Leave
router.get("/leave/balances", leave.listMyBalances);
router.get("/leave/requests", leave.listLeaveRequests);
router.post("/leave/requests", leave.applyLeave);
router.post("/leave/requests/:id/review", adminOnly, leave.reviewLeave);
router.post("/leave/requests/:id/cancel", leave.cancelLeave);

// Payroll / profiles
router.get("/profiles", adminOnly, payroll.listEmployeeProfiles);
router.get("/profiles/:userId", payroll.getEmployeeProfile);
router.put("/profiles/:userId", payroll.upsertEmployeeProfile);
router.get("/salary-structures", payroll.listSalaryStructures);
router.post("/salary-structures", adminOnly, payroll.createSalaryStructure);
router.get("/payroll-runs", adminOnly, payroll.listPayrollRuns);
router.post("/payroll/run", adminOnly, payroll.runPayroll);
router.get("/salary-slips", payroll.listSalarySlips);
router.get("/salary-slips/:uuid/file", payroll.getSalarySlipFile);
router.get("/salary-slips/:uuid", payroll.getSalarySlip);

// Documents
router.get("/documents", documents.listDocuments);
router.post("/documents", upload.single("file"), documents.uploadDocument);
router.get("/documents/:uuid/download", documents.downloadDocument);
router.delete("/documents/:id", documents.deleteDocument);

// Notifications / audit
router.get("/notifications", notifications.listNotifications);
router.post("/notifications/read-all", notifications.markAllRead);
router.post("/notifications/:id/read", notifications.markNotificationRead);
router.get("/audit-logs", adminOnly, notifications.listAuditLogs);

export default router;

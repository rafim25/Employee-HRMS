import express from "express";
import {
  getEmployeeProfile,
  getEmployeeLoanStatistics,
  getEmployeeRecentLoans,
  getEmployeeRecentActivities,
  getLoanTransactions,
} from "../controllers/EmployeeController.js";
import { verify_User as verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

// Employee profile and loan routes
router.get("/api/employee/profile", verifyUser, getEmployeeProfile);
router.get(
  "/api/employee/loan-statistics",
  verifyUser,
  getEmployeeLoanStatistics
);
router.get("/api/employee/recent-loans", verifyUser, getEmployeeRecentLoans);
router.get(
  "/api/employee/recent-activities",
  verifyUser,
  getEmployeeRecentActivities
);
router.get("/api/loan-transactions/:id", verifyUser, getLoanTransactions);

export default router;

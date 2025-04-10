import express from "express";
import { getDashboardStats, getDashboardDataRecruitment, getEmployeeDashboardStats } from "../controllers/DashboardController.js";
import { verifyUser, verify_User } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/api/dashboard/stats", verify_User, getDashboardStats);
router.get("/api/dashboard/recruitment", verify_User, getDashboardDataRecruitment);
router.get("/api/dashboard/employee-stats", verify_User, getEmployeeDashboardStats);
export default router;

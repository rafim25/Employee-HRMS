import express from "express";
import { getDashboardStats, getDashboardDataRecruitment  } from "../controllers/DashboardController.js";
import { verifyUser, verify_User } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/api/dashboard/stats", verify_User, getDashboardStats);
router.get("/api/dashboard/recruitment", verify_User, getDashboardDataRecruitment);

export default router;

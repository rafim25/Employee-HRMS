import express from "express";
import { getDashboardStats } from "../controllers/DashboardController.js";
import { verifyUser, verify_User } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/api/dashboard/stats", verify_User, getDashboardStats);

export default router;

import express from "express";
import { getDashboardStats } from "../controllers/DashboardController.js";
import { verifyUser } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

router.get("/api/dashboard/stats", verifyUser, getDashboardStats);

export default router;

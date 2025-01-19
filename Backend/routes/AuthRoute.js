import express from "express";
import { Login, LogOut, Me } from "../controllers/Auth.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/api/auth/me", verifyUser, Me);
router.post("/api/auth/login", Login);
router.post("/api/auth/logout", LogOut);

export default router;

import express from "express";
import {
  LoginV2,
  LogOutV2,
  MeV2,
  RequestPasswordReset,
  CheckSession,
} from "../controllers/AuthV2.js";
import { verify_User } from "../middleware/AuthUser.js";

const router = express.Router();

// Auth routes
router.post("/api/v2/login", LoginV2);
router.post("/api/v2/logout", LogOutV2);
router.get("/api/v2/me", verify_User, MeV2);
router.post("/api/v2/request-reset", RequestPasswordReset);
router.get("/api/v2/check-session", CheckSession);

export default router;

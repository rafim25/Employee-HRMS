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
router.post("/v2/login", LoginV2);
router.delete("/v2/logout", LogOutV2);
router.get("/v2/me", verify_User, MeV2);
router.post("/v2/request-reset", RequestPasswordReset);
router.get("/v2/check-session", CheckSession);

export default router;

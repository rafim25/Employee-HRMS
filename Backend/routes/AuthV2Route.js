import express from "express";
import {
  LoginV2,
  LogOutV2,
  MeV2,
  RequestPasswordReset,
  CheckSession,
} from "../controllers/AuthV2.js";
import { verify_User } from "../middleware/AuthUser.js";
import AuthController from "../controllers/AuthController.js";

const router = express.Router();

// Auth routes
router.post("/api/v2/login", AuthController.login);
router.post("/api/v2/logout", AuthController.logout);
router.get("/api/v2/me", verify_User, AuthController.me);
router.post("/v2/request-reset", RequestPasswordReset);
router.get("/v2/check-session", CheckSession);

export default router;

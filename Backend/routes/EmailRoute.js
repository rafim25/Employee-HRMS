import express from "express";
import {
  sendContactEmail,
  testEmailDelivery,
} from "../controllers/EmailController.js";

const router = express.Router();

// Contact form submission route
router.post("/email/contact", sendContactEmail);

// Test email delivery route
router.get("/email/test", testEmailDelivery);

export default router;

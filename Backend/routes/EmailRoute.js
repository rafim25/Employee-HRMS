import express from "express";
import {
  sendContactEmail,
  testEmailDelivery,
  sendForestViewContactEmail
} from "../controllers/EmailController.js";

const router = express.Router();

// Contact form submission route
router.post("/email/contact", sendContactEmail);

// Forest View contact form submission route
router.post("/email/contact/forestview", sendForestViewContactEmail);

// Test email delivery route
router.get("/email/test", testEmailDelivery);

export default router;

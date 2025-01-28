import express from "express";
import { sendContactEmail } from "../controllers/EmailController.js";

const router = express.Router();

// Contact form submission route
router.post("/email/contact", sendContactEmail);

export default router;

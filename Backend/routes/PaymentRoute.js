import express from "express";
import { getPaymentQR, verifyQRPayment, getPaymentStatus } from "../controllers/PaymentController.js";
import { verify_User } from "../middleware/VerifyUser.js";

const router = express.Router();

// Get payment QR code
router.get("/qr/:booking_id", verify_User, getPaymentQR);

// Verify QR payment (admin only)
router.post("/verify", verify_User, verifyQRPayment);

// Get payment status
router.get("/status/:booking_id", verify_User, getPaymentStatus);

export default router; 
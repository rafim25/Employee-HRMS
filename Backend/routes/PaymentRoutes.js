import express from 'express';
import { verify_User } from '../middleware/AuthUser.js';
import {
    getPaymentQR,
    verifyQRPayment,
    getPaymentStatus
} from '../controllers/PaymentController.js';

const router = express.Router();

// Public routes
router.get('/api/payments/qr/:booking_id', getPaymentQR);
router.post('/api/payments/verify', verifyQRPayment);
router.get('/api/payments/status/:booking_id', getPaymentStatus);

// Protected routes (admin only)
router.get('/api/admin/payments', verify_User, (req, res) => {
    // Admin payment listing logic
});

export default router; 
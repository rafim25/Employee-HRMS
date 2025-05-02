import express from 'express';
import { getBookingDashboardData } from '../controllers/BookingDashboardController.js';

const router = express.Router();

router.get('/api/dashboard/booking', getBookingDashboardData);

export default router; 
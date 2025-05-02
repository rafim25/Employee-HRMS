import express from 'express';
import { getHotelDashboardStats } from '../controllers/HotelDashboardController.js';
import { verify_User } from '../middleware/AuthUser.js';

const router = express.Router();

// Protected route for hotel dashboard stats
router.get('/api/hotel-dashboard/stats', verify_User, getHotelDashboardStats);

export default router; 
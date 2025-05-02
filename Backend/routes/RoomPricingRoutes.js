import express from 'express';
import { verify_User } from '../middleware/AuthUser.js';
import {
  getPricingHistory,
  setRoomPrice,
  getCurrentPrice,
  updateRoomPrice,
  deleteRoomPrice
} from '../controllers/RoomPricingController.js';

const router = express.Router();

// Protected routes (admin only)
router.get('/api/admin/rooms/pricing-history', verify_User, getPricingHistory);
router.post('/api/admin/rooms/pricing', verify_User, setRoomPrice);
router.get('/api/admin/rooms/:room_id/current-price', verify_User, getCurrentPrice);
router.put('/api/admin/rooms/pricing/:pricing_id', verify_User, updateRoomPrice);
router.delete('/api/admin/rooms/pricing/:pricing_id', verify_User, deleteRoomPrice);

export default router; 
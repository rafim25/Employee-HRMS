import express from 'express';
import {
    createRoom,
    getAllRooms,
    getRoomById,
    getRoomDetails,
    updateRoom,
    deleteRoom,
    getAvailableRooms,
    addRoom,
    resetAllRoomStatus
} from '../controllers/HotelRoomController.js';
import { verify_User } from '../middleware/AuthUser.js';

const router = express.Router();

// Public routes
router.get('/api/rooms', getAllRooms);
router.get('/api/rooms/available', getAvailableRooms);
router.get('/api/rooms/:id', getRoomById);
router.get('/api/rooms/:id/details', getRoomDetails);

// Admin routes (add new room, reset all room statuses)
router.post('/api/admin/rooms/add', addRoom); // Add new room (admin)
router.post('/api/admin/rooms/reset-status', resetAllRoomStatus); // Reset all room statuses to available (admin)
router.get('/api/admin/rooms/list', getAllRooms); // Admin route to get all rooms (for admin interface)

// Protected routes (admin only)
router.put('/api/admin/rooms/:id', verify_User, updateRoom);
router.delete('/api/admin/rooms/:id', verify_User, deleteRoom);

export default router; 
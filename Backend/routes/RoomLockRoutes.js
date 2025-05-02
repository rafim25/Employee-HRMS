import express from 'express';
import { lockRoom, unlockRoom, checkRoomLock } from '../controllers/RoomLockController.js';

const router = express.Router();

// Lock a room
router.post('/api/rooms/lock', lockRoom);

// Unlock a room
router.post('/api/rooms/unlock', unlockRoom);

// Check room lock status
router.get('/api/rooms/:room_id/lock-status', checkRoomLock);

export default router; 
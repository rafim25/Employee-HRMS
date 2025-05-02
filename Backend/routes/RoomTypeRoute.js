import express from 'express';
import { getAllRoomTypes, createRoomType } from '../controllers/RoomTypeController.js';

const router = express.Router();

router.get('/api/room-types', getAllRoomTypes);
router.post('/api/room-types', createRoomType);

export default router; 
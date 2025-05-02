import express from 'express';
import { verify_User } from '../middleware/AuthUser.js';
import {
    registerVisitor,
    loginVisitor,
    getVisitorProfile,
    updateVisitorProfile,
    changePassword,
    getAllVisitors,
    getVisitorById,
    deleteVisitor
} from '../controllers/VisitorController.js';

const router = express.Router();

// Public routes
router.post('/api/visitors/register', registerVisitor);
router.post('/api/visitors/login', loginVisitor);
router.get('/api/visitors/:visitor_id/profile', getVisitorProfile);
router.put('/api/visitors/:visitor_id/profile', updateVisitorProfile);
router.put('/api/visitors/:visitor_id/password', changePassword);

// Protected routes (admin only)
router.get('/api/admin/visitors', verify_User, getAllVisitors);
router.get('/api/admin/visitors/:id', verify_User, getVisitorById);
router.delete('/api/admin/visitors/:id', verify_User, deleteVisitor);

export default router; 
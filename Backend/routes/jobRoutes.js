import express from 'express';
import {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
} from '../controllers/jobController.js';
import {
  verify_User as verifyUser,
  admin_Only as adminOnly,
} from '../middleware/AuthUser.js';

const router = express.Router();

// Basic CRUD routes
router.get('/api/jobs', verifyUser, getJobs);
router.get('/api/jobs/:id', verifyUser, getJobById);
router.post('/api/jobs', verifyUser, adminOnly, createJob);
router.put('/api/jobs/:id', verifyUser, adminOnly, updateJob);
router.delete('/api/jobs/:id', verifyUser, adminOnly, deleteJob);

// Update job route
router.patch('/api/jobs/:id', updateJob);

export default router; 
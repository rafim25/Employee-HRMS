import express from 'express';
import {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  updateJobStatus,
  bulkUploadJobs,
} from '../controllers/jobController.js';
import {
  verify_User as verifyUser,
  admin_Only as adminOnly,
} from '../middleware/AuthUser.js';

const router = express.Router();

router.get('/api/jobs', verifyUser, getJobs);
router.post('/api/jobs/bulk-upload', verifyUser, bulkUploadJobs);
router.get('/api/jobs/:id', verifyUser, getJobById);
router.post('/api/jobs', verifyUser, createJob);
router.put('/api/jobs/:id', verifyUser, updateJob);
router.delete('/api/jobs/:id', verifyUser, adminOnly, deleteJob);
router.patch('/api/jobs/:id/status',verifyUser, adminOnly, updateJobStatus);
router.patch('/api/jobs/:id',verifyUser, updateJob);

export default router;

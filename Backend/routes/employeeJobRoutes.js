import express from 'express';
import { verify_User } from '../middleware/AuthUser.js';
import {
    getEmployeeJobs,
    getEmployeeJobById,
    createEmployeeJob,
    updateEmployeeJob,
    getJobStatistics
} from '../controllers/EmployeeJobController.js';

const router = express.Router();

// All routes are prefixed with /api/employee
router.get('/api/employee/jobs', verify_User, getEmployeeJobs);
router.get('/api/employee/jobs/:id', verify_User, getEmployeeJobById);
router.post('/api/employee/jobs', verify_User, createEmployeeJob);
router.put('/api/employee/jobs/:id', verify_User, updateEmployeeJob);
router.get('/api/employee/jobs/statistics', verify_User, getJobStatistics);

export default router; 
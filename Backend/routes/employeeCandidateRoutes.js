import express from 'express';
import { verify_User } from '../middleware/AuthUser.js';
import {
    getEmployeeCandidates,
    getEmployeeCandidateById,
    updateEmployeeCandidate,
    getEmployeeCandidatesByJob
} from '../controllers/EmployeeCandidateController.js';

const router = express.Router();

// All routes are prefixed with /api/employee
router.get('/api/employee/candidates', verify_User, getEmployeeCandidates);
router.get('/api/employee/candidates/:id', verify_User, getEmployeeCandidateById);
router.put('/api/employee/candidates/:id', verify_User, updateEmployeeCandidate);
router.get('/api/employee/jobs/:jobId/candidates', verify_User, getEmployeeCandidatesByJob);

export default router; 
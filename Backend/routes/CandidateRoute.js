import express from "express";
import {
  getCandidates,
  getCandidateById,
  getCandidatesByJob,
  createCandidate,
  updateCandidate,
  deleteCandidate,
  updateCandidateStatus,
  applyForJob,
  getCandidatesByJobId
} from "../controllers/CandidateController.js";
import {
  verify_User as verifyUser,
  admin_Only as adminOnly,
} from '../middleware/AuthUser.js';

const router = express.Router();

// Admin routes
router.get('/api/candidates', verifyUser, adminOnly, getCandidates);
router.get('/api/candidates/:id', verifyUser, getCandidateById);
router.post('/api/candidates', verifyUser, adminOnly, createCandidate);
router.put('/api/candidates/:id', verifyUser, adminOnly, updateCandidate);
router.delete('/api/candidates/:id', verifyUser, adminOnly, deleteCandidate);
router.patch('/api/candidates/:uuid/status', verifyUser, adminOnly, updateCandidateStatus);

// Job-specific candidate routes
// router.get('/api/candidates/job/:jobId', verifyUser, adminOnly, getCandidatesByJob);
router.get('/api/candidates/job/:jobId', getCandidatesByJobId);

// Public application route
router.post('/api/candidates/apply/:jobId', verifyUser, applyForJob);

// Update candidate details
router.put('/api/candidates/:id', verifyUser,adminOnly, updateCandidate);


// Update candidate status
router.patch('/api/candidates/:id/status', verifyUser,adminOnly, updateCandidateStatus);

export default router; 

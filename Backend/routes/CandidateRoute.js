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
  getCandidatesByJobId,
  shareCandidates,
  rejectCandidate,
  bulkUploadCandidates,
  checkDuplicate
} from "../controllers/CandidateController.js";
import { sendCandidatesToClient } from "../controllers/EmailController.js";
import {
  verify_User as verifyUser,
  admin_Only as adminOnly,
} from '../middleware/AuthUser.js';
import { checkPermission } from '../middleware/checkPermission.js';

const router = express.Router();

// Admin routes
router.get('/api/candidates', verifyUser, adminOnly, getCandidates);
router.get('/api/candidates/:id', verifyUser, getCandidateById);
router.post('/api/candidates', verifyUser, adminOnly, createCandidate);
router.put('/api/candidates/:id', verifyUser, adminOnly, checkPermission, updateCandidate);
router.delete('/api/candidates/:id', verifyUser, adminOnly, checkPermission, deleteCandidate);
router.patch('/api/candidates/:uuid/status', verifyUser, adminOnly, updateCandidateStatus);
router.patch('/api/candidates/:uuid/reject', verifyUser, adminOnly, rejectCandidate);
// Job-specific candidate routes
// router.get('/api/candidates/job/:jobId', verifyUser, adminOnly, getCandidatesByJob);
router.get('/api/candidates/job/:jobId', getCandidatesByJobId);

// Public application route
router.post('/api/candidates/apply/:jobId', verifyUser, applyForJob);

// Update candidate details
router.put('/api/candidates/:id', verifyUser,adminOnly, updateCandidate);


// Update candidate status
router.patch('/api/candidates/:id/status', verifyUser,adminOnly, updateCandidateStatus);
router.post('/api/candidates/share', verifyUser,adminOnly, sendCandidatesToClient);

// Add the bulk upload route
router.post('/api/candidates/bulk-upload', verifyUser, adminOnly, bulkUploadCandidates);

// Add this route with your other candidate routes
router.post('/api/candidates/check-duplicate', verifyUser, adminOnly, checkDuplicate);

export default router; 

import express from "express";
import multer from "multer";
import {
  getCandidates,
  getCandidatesPaginated,
  searchCandidates,
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
  checkDuplicate,
  uploadCandidateAttachment,
} from "../controllers/CandidateController.js";
import {
  previewBulkImport,
  commitBulkImport,
} from "../controllers/bulkImportController.js";
import { sendCandidatesToClient } from "../controllers/EmailController.js";
import {
  verify_User as verifyUser,
  admin_Only as adminOnly,
} from '../middleware/AuthUser.js';
import { checkPermission } from '../middleware/checkPermission.js';

const router = express.Router();

const uploadMemory = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// Larger limit for Excel + ZIP bulk import (100MB per file)
const bulkImportUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 },
});

// Accept whichever field name the client sends (resume | image | file)
const candidateUpload = (req, res, next) => {
  uploadMemory.fields([
    { name: "resume", maxCount: 1 },
    { name: "image", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ])(req, res, (err) => {
    if (err) return next(err);
    const files = req.files || {};
    req.file =
      files.resume?.[0] ||
      files.image?.[0] ||
      files.file?.[0] ||
      null;
    next();
  });
};

// Admin routes
router.get('/api/candidates', verifyUser, getCandidates);
router.get('/api/candidates/paginated', verifyUser, getCandidatesPaginated);
router.get('/api/candidates/search', verifyUser, searchCandidates);
router.get('/api/candidates/:id', verifyUser, getCandidateById);
router.post('/api/candidates', verifyUser, createCandidate);
router.put('/api/candidates/:id', verifyUser, adminOnly, checkPermission, updateCandidate);
router.post(
  '/api/candidates/:id/upload/:type',
  verifyUser,
  candidateUpload,
  uploadCandidateAttachment
);
router.delete('/api/candidates/:id', verifyUser, adminOnly, checkPermission, deleteCandidate);
router.patch('/api/candidates/:uuid/status', verifyUser, updateCandidateStatus);
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
// Any authenticated user (admin or employee) can share shortlisted candidates
router.post('/api/candidates/share', verifyUser, sendCandidatesToClient);

// Add the bulk upload route (legacy JSON body)
router.post('/api/candidates/bulk-upload', verifyUser, bulkUploadCandidates);

// Server-side Excel + ZIP import (preview → commit)
router.post(
  '/api/candidates/bulk-import/preview',
  verifyUser,
  bulkImportUpload.fields([
    { name: 'excel', maxCount: 1 },
    { name: 'zip', maxCount: 1 },
  ]),
  previewBulkImport
);
router.post(
  '/api/candidates/bulk-import/commit',
  verifyUser,
  bulkImportUpload.fields([
    { name: 'excel', maxCount: 1 },
    { name: 'zip', maxCount: 1 },
  ]),
  commitBulkImport
);

// Add the check duplicate route
router.post("/api/candidates/check-duplicate", checkDuplicate);

export default router; 


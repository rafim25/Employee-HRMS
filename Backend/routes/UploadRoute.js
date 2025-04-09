import express from "express";
import multer from "multer";
import { uploadToS3 } from "../utils/s3Config.js";
import {
  verify_User as verifyUser,
  admin_Only as adminOnly,
} from '../middleware/AuthUser.js';

const router = express.Router();

// ✅ Configure multer ONCE
const storage = multer.memoryStorage();
const multerUpload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// ✅ Resume upload endpoint
router.post('/api/upload/resume', verifyUser, adminOnly, multerUpload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded'
    });
  }

  try {
    const url = await uploadToS3(req.file, 'resumes');
    res.json({
      success: true,
      url: url,
      message: 'Resume uploaded successfully'
    });
  } catch (error) {
    console.error('S3 upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload resume',
      error: error.message
    });
  }
});

// ✅ Photo upload endpoint
router.post("/api/upload/photo", verifyUser, adminOnly, multerUpload.single("photo"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No photo uploaded" });
  }

  try {
    const url = await uploadToS3(req.file, "photos");
    res.json({ success: true, url, message: "Photo uploaded successfully" });
  } catch (error) {
    console.error("S3 Photo Upload Error:", error);
    res.status(500).json({ success: false, message: "Failed to upload photo" });
  }
});

export default router;

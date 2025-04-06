import express from "express";
import multer from "multer";
import { uploadToS3 } from "../utils/s3Config.js";
import {
  verify_User as verifyUser,
  admin_Only as adminOnly,
} from '../middleware/AuthUser.js';

const router = express.Router();

// Configure multer
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
}).single('file');

// Resume upload endpoint
router.post('/api/upload/resume', verifyUser, adminOnly, (req, res) => {
  upload(req, res, async function(err) {
    if (err) {
      console.error('Upload error:', err);
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }

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
});

export default router; 
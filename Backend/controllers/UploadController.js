import { uploadToS3 } from "../utils/s3Config.js";
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export const uploadResume = async (req, res) => {
    try {
        // File validation is already done in middleware
        const file = req.file;
        
        // Upload to S3
        const url = await uploadToS3(file, 'resumes');
        
        return res.status(200).json({
            success: true,
            url: url,
            message: 'Resume uploaded successfully'
        });
    } catch (error) {
        console.error('Upload error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to upload resume',
            error: error.message
        });
    }
};

// Additional upload-related controller functions can be added here
export const deleteFile = async (req, res) => {
    try {
        const { fileKey } = req.params;
        // Add logic to delete file from S3
        // ...

        res.json({
            success: true,
            message: 'File deleted successfully'
        });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete file',
            error: error.message
        });
    }
};

export const uploadPhoto = async (req, res) => {
    try {
        if (!req.files || !req.files.photo) {
            return res.status(400).json({ msg: "No photo uploaded" });
        }

        const file = req.files.photo;
        const fileSize = file.data.length;
        const ext = path.extname(file.name);
        const fileName = `${uuidv4()}${ext}`;
        const allowedTypes = ['.png', '.jpg', '.jpeg'];

        // Validate file type
        if (!allowedTypes.includes(ext.toLowerCase())) {
            return res.status(422).json({ msg: "Invalid image format" });
        }

        // Validate file size (5MB limit)
        if (fileSize > 5000000) {
            return res.status(422).json({ msg: "Image must be less than 5 MB" });
        }

        // Move file to public directory
        await file.mv(`./public/images/${fileName}`);

        // Generate URL
        const baseUrl = process.env.NODE_ENV === "production"
            ? "http://172.105.59.206:3002"
            : `${req.protocol}://${req.get("host")}`;
        const url = `${baseUrl}/images/${fileName}`;

        res.status(200).json({
            msg: "Photo uploaded successfully",
            fileName: fileName,
            url: url
        });

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            msg: "Error uploading photo",
            error: error.message
        });
    }
}; 
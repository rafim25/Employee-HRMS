import { uploadToS3 } from "../utils/s3Config.js";

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
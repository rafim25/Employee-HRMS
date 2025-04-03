import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

export const uploadToS3 = async (file, folder = 'resumes') => {
    try {
        // Generate unique filename
        const fileExtension = file.originalname.split('.').pop();
        const fileName = `${folder}/${uuidv4()}.${fileExtension}`;

        // Set upload parameters
        const params = {
            Bucket: process.env.AWS_S3_BUCKET,
            Key: fileName,
            Body: file.buffer,
            ContentType: file.mimetype,
            // Set expiry for presigned URLs
            Expires: 60 * 60 * 24 * 7, // 7 days
            // Enable compression for PDFs and large files
            ContentEncoding: 'gzip',
            // Cache settings
            CacheControl: 'max-age=31536000',
            // Make file public but secure
            ACL: 'private'
        };

        // Upload to S3
        const result = await s3.upload(params).promise();
        return result.Location;
    } catch (error) {
        console.error('S3 upload error:', error);
        throw new Error('Failed to upload file to S3');
    }
};

// Generate temporary URL for private files
export const getSignedUrl = async (fileKey) => {
    const params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: fileKey,
        Expires: 3600 // URL expires in 1 hour
    };
    return s3.getSignedUrl('getObject', params);
}; 
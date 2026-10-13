import AWS from 'aws-sdk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getBucketName = () =>
  process.env.AWS_BUCKET_NAME || process.env.AWS_S3_BUCKET || '';

const isS3Configured = () =>
  Boolean(
    getBucketName() &&
      process.env.AWS_ACCESS_KEY_ID &&
      process.env.AWS_SECRET_ACCESS_KEY
  );

const s3 = isS3Configured()
  ? new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION || 'ap-south-1',
    })
  : null;

const getLocalUploadsRoot = () =>
  path.join(__dirname, '..', 'public', 'uploads');

const getPublicBaseUrl = () => {
  const configured = process.env.APP_PUBLIC_URL || process.env.BACKEND_URL;
  if (configured) return configured.replace(/\/$/, '');
  const port = process.env.APP_PORT || process.env.PORT || 3002;
  return `http://localhost:${port}`;
};

const uploadLocally = async (file, folder = 'resumes') => {
  const fileExtension = (file.originalname.split('.').pop() || 'bin').toLowerCase();
  const fileName = `${uuidv4()}.${fileExtension}`;
  const folderPath = path.join(getLocalUploadsRoot(), folder);

  await fs.promises.mkdir(folderPath, { recursive: true });
  await fs.promises.writeFile(path.join(folderPath, fileName), file.buffer);

  return `${getPublicBaseUrl()}/uploads/${folder}/${fileName}`;
};

export const uploadToS3 = async (file, folder = 'resumes') => {
  try {
    if (!isS3Configured()) {
      console.warn(
        'AWS S3 is not configured (missing AWS_BUCKET_NAME / credentials). Saving upload locally under public/uploads.'
      );
      return uploadLocally(file, folder);
    }

    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${folder}/${uuidv4()}.${fileExtension}`;

    const params = {
      Bucket: getBucketName(),
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    const result = await s3.upload(params).promise();
    return result.Location;
  } catch (error) {
    console.error('S3 upload error:', error);

    // Local fallback if S3 call fails (e.g. bad credentials in local env)
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Falling back to local disk upload after S3 failure.');
      return uploadLocally(file, folder);
    }

    throw new Error('Failed to upload file to S3');
  }
};

// Generate temporary URL for private files
export const getSignedUrl = async (fileKey) => {
  if (!isS3Configured()) {
    if (String(fileKey).startsWith('http')) return fileKey;
    return `${getPublicBaseUrl()}/${String(fileKey).replace(/^\//, '')}`;
  }

  const params = {
    Bucket: getBucketName(),
    Key: fileKey,
    Expires: 3600, // URL expires in 1 hour
  };
  return s3.getSignedUrl('getObject', params);
};

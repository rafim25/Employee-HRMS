import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import AWS from 'aws-sdk';
import HotelRoom from '../models/HotelRoom.js';
import Activity from '../models/Activity.js';
import Gallery from '../models/Gallery.js';

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const s3 = new AWS.S3();
const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

// Upload room image to S3
export const uploadRoomImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { roomId } = req.params;
    const fileExtension = path.extname(req.file.originalname);
    const fileName = `rooms/${roomId}-${uuidv4()}${fileExtension}`;
    
    // Upload to S3
    const params = {
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: fs.createReadStream(req.file.path),
      ContentType: req.file.mimetype,
      ACL: 'public-read'
    };
    
    const result = await s3.upload(params).promise();
    
    // Delete temporary file
    fs.unlinkSync(req.file.path);
    
    // Update room with image URL
    await HotelRoom.update(
      { image_url: result.Location },
      { where: { room_id: roomId } }
    );
    
    res.status(201).json({
      message: 'Image uploaded successfully',
      imageUrl: result.Location
    });
  } catch (error) {
    console.error('Upload room image error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Upload gallery image to S3
export const uploadGalleryImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileExtension = path.extname(req.file.originalname);
    const fileName = `gallery/${uuidv4()}${fileExtension}`;
    
    // Upload to S3
    const params = {
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: fs.createReadStream(req.file.path),
      ContentType: req.file.mimetype,
      ACL: 'public-read'
    };
    
    const result = await s3.upload(params).promise();
    
    // Delete temporary file
    fs.unlinkSync(req.file.path);
    
    // Save to database
    await Gallery.create({
      image_url: result.Location,
      title: req.body.title || 'Gallery Image',
      description: req.body.description || ''
    });
    
    res.status(201).json({
      message: 'Image uploaded successfully',
      imageUrl: result.Location
    });
  } catch (error) {
    console.error('Upload gallery image error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Upload activity image to S3
export const uploadActivityImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { activityId } = req.params;
    const fileExtension = path.extname(req.file.originalname);
    const fileName = `activities/${activityId}-${uuidv4()}${fileExtension}`;
    
    // Upload to S3
    const params = {
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: fs.createReadStream(req.file.path),
      ContentType: req.file.mimetype,
      ACL: 'public-read'
    };
    
    const result = await s3.upload(params).promise();
    
    // Delete temporary file
    fs.unlinkSync(req.file.path);
    
    // Update activity with image URL
    await Activity.update(
      { image_url: result.Location },
      { where: { activity_id: activityId } }
    );
    
    res.status(201).json({
      message: 'Image uploaded successfully',
      imageUrl: result.Location
    });
  } catch (error) {
    console.error('Upload activity image error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Delete image from S3
export const deleteImage = async (req, res) => {
  try {
    const { type, imageId } = req.params;
    
    // Get the image URL from the database based on type
    let imageUrl;
    if (type === 'rooms') {
      const room = await HotelRoom.findOne({ where: { room_id: imageId } });
      imageUrl = room?.image_url;
    } else if (type === 'gallery') {
      const gallery = await Gallery.findOne({ where: { gallery_id: imageId } });
      imageUrl = gallery?.image_url;
    } else if (type === 'activities') {
      const activity = await Activity.findOne({ where: { activity_id: imageId } });
      imageUrl = activity?.image_url;
    } else {
      return res.status(400).json({ message: 'Invalid image type' });
    }
    
    if (!imageUrl) {
      return res.status(404).json({ message: 'Image not found' });
    }
    
    // Extract key from URL
    const key = imageUrl.split(`${BUCKET_NAME}/`)[1];
    
    // Delete from S3
    const params = {
      Bucket: BUCKET_NAME,
      Key: key
    };
    
    await s3.deleteObject(params).promise();
    
    // Update database to remove image URL
    if (type === 'rooms') {
      await HotelRoom.update({ image_url: null }, { where: { room_id: imageId } });
    } else if (type === 'gallery') {
      await Gallery.destroy({ where: { gallery_id: imageId } });
    } else if (type === 'activities') {
      await Activity.update({ image_url: null }, { where: { activity_id: imageId } });
    }
    
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get all gallery images
export const getAllGalleryImages = async (req, res) => {
  try {
    const galleryImages = await Gallery.findAll({
      order: [['createdAt', 'DESC']]
    });
    
    res.json({ images: galleryImages });
  } catch (error) {
    console.error('Get gallery images error:', error);
    res.status(500).json({ message: error.message });
  }
}; 
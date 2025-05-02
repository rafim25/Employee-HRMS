import express from 'express';
import multer from 'multer';
import { verify_User } from '../middleware/AuthUser.js';
import {
    getAllBookings,
    updateBooking,
    getBookings,
    getBookingById,
    createBooking,
    updateBookingStatus,
    deleteBooking,
    processPayment
} from '../controllers/BookingController.js';
import {
    getBookingsForCalendar,
    getBookingStats,
    checkRoomAvailability
} from '../controllers/BookingCalendarController.js';
import {
    uploadRoomImage,
    uploadGalleryImage,
    uploadActivityImage,
    deleteImage,
    getAllGalleryImages
} from '../controllers/ImageController.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/tmp/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// import {
//     getAllBookings,
//     createBooking,
//     updateBooking,
//     deleteBooking,
//     getBookingById
//   } from '../controllers/BookingController.js';
  
  
  // Get all bookings
//   router.get('/', getAllBookings);
  
  // Get booking by ID
//   router.get('/:id', getBookingById);
  
  // Create new booking
//   router.post('/', createBooking);
  
  // Update booking
//   router.put('/:id', updateBooking);
  
  // Delete booking
//   router.delete('/:id', deleteBooking);
  

// Public booking routes
router.get('/api/admin/bookings', verify_User, getAllBookings);

router.get('/api/bookings', getBookings);
router.post('/api/bookings', createBooking);
router.get('/api/bookings/:id', getBookingById);

// Protected booking routes (admin only)
router.put('/api/admin/bookings/:id/status', verify_User, updateBookingStatus);
router.delete('/api/admin/bookings/:id', verify_User, deleteBooking);

// Image routes
router.get('/api/images/rooms/:roomId', (req, res) => {
    // Route to get room images
    res.sendFile(`${process.cwd()}/uploads/rooms/${req.params.roomId}`);
});

router.get('/api/images/gallery/:imageId', (req, res) => {
    // Route to get gallery images
    res.sendFile(`${process.cwd()}/uploads/gallery/${req.params.imageId}`);
});

router.get('/api/images/activities/:activityId', (req, res) => {
    // Route to get activity images
    res.sendFile(`${process.cwd()}/uploads/activities/${req.params.activityId}`);
});

// Image upload routes (admin only)
router.post('/api/images/rooms/:roomId', verify_User, upload.single('image'), uploadRoomImage);
router.post('/api/images/gallery', verify_User, upload.single('image'), uploadGalleryImage);
router.post('/api/images/activities/:activityId', verify_User, upload.single('image'), uploadActivityImage);
router.delete('/api/images/:type/:imageId', verify_User, deleteImage);
router.get('/api/images/gallery', getAllGalleryImages);

// Booking calendar routes
router.get('/api/bookings/calendar', verify_User, getBookingsForCalendar);

// Booking statistics routes
router.get('/api/bookings/stats', verify_User, getBookingStats);

// Room availability routes
router.get('/api/rooms/availability', checkRoomAvailability);

router.put('/api/bookings/:id/status', verify_User, updateBookingStatus);

export default router; 
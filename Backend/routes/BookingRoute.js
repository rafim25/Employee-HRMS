import express from 'express';
import {
  getAllBookings,
  createBooking,
  updateBooking,
  deleteBooking,
  getBookingById
} from '../controllers/BookingController.js';

const router = express.Router();

// Get all bookings
router.get('/', getAllBookings);

// Get booking by ID
router.get('/:id', getBookingById);

// Create new booking
router.post('/', createBooking);

// Update booking
router.put('/:id', updateBooking);

// Delete booking
router.delete('/:id', deleteBooking);

export default router; 
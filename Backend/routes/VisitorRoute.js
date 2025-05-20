import express from 'express';
import {
  getAllVisitors,
  getVisitorById,
  createVisitor,
  updateVisitor,
  deleteVisitor,
  getVisitorBookings,
  ensureVisitorExists
} from '../controllers/VisitorController.js';

const router = express.Router();

// Get all visitors
router.get('/', getAllVisitors);

// Get visitor by ID
router.get('/:id', getVisitorById);

// Create new visitor
router.post('/', createVisitor);

// Ensure visitor exists
router.post('/ensure', ensureVisitorExists);

// Update visitor
router.put('/:id', updateVisitor);

// Delete visitor
router.delete('/:id', deleteVisitor);

// Get visitor's bookings
router.get('/:id/bookings', getVisitorBookings);

export default router; 
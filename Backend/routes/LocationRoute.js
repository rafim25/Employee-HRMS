import express from 'express';
import {
  getIndianStates,
  getDistrictsByState,
  getCitiesByDistrict,
  listManagedLocations,
  createManagedLocation,
  bulkCreateManagedLocations,
  updateManagedLocation,
  deleteManagedLocation,
} from '../controllers/LocationController.js';
import {
  verify_User as verifyUser,
  admin_Only as adminOnly,
} from '../middleware/AuthUser.js';

const router = express.Router();

// App consumption — local DB
router.get('/api/locations/states', verifyUser, getIndianStates);
router.get('/api/locations/states/:stateCode/districts', verifyUser, getDistrictsByState);
router.get(
  '/api/locations/states/:stateCode/districts/:districtCode/cities',
  verifyUser,
  getCitiesByDistrict
);

// Admin management
router.get('/api/locations/manage', verifyUser, adminOnly, listManagedLocations);
router.post('/api/locations/manage/bulk', verifyUser, adminOnly, bulkCreateManagedLocations);
router.post('/api/locations/manage', verifyUser, adminOnly, createManagedLocation);
router.put('/api/locations/manage/:id', verifyUser, adminOnly, updateManagedLocation);
router.delete('/api/locations/manage/:id', verifyUser, adminOnly, deleteManagedLocation);

export default router;

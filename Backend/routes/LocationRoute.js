import express from 'express';
import { getIndianStates, getDistrictsByState, getCitiesByDistrict } from '../controllers/LocationController.js';
import { verify_User as verifyUser } from '../middleware/AuthUser.js';

const router = express.Router();

// Get all Indian states
router.get('/api/locations/states', verifyUser, getIndianStates);

// Get districts by state code
router.get('/api/locations/states/:stateCode/districts', verifyUser, getDistrictsByState);

// Get cities by state and district code
router.get('/api/locations/states/:stateCode/districts/:districtCode/cities', verifyUser, getCitiesByDistrict);

export default router; 
const express = require('express');
const { rejectCandidate } = require('../controllers/CandidateController');

const router = express.Router();

router.patch('/candidates/:uuid/reject', rejectCandidate);

module.exports = router; 
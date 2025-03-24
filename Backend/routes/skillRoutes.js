import express from 'express';
import {
  getSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill,
} from '../controllers/skillController.js';
import {
  verify_User as verifyUser,
  admin_Only as adminOnly,
} from '../middleware/AuthUser.js';

const router = express.Router();

// Basic CRUD routes
router.get('/api/skills', verifyUser, getSkills);
router.get('/api/skills/:id', verifyUser, getSkillById);
router.post('/api/skills', verifyUser, adminOnly, createSkill);
router.put('/api/skills/:id', verifyUser, adminOnly, updateSkill);
router.delete('/api/skills/:id', verifyUser, adminOnly, deleteSkill);

export default router;
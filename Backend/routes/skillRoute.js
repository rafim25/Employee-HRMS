import express from 'express';
import {
    getSkills,
    getSkillById,
    createSkill,
    updateSkill,
    deleteSkill
} from '../controllers/skillController.js';
import { verify_User, admin_Only } from '../middleware/AuthUser.js';

const router = express.Router();

// Basic routes without /api/skills prefix
router.get('/', verify_User, getSkills);
router.get('/:id', verify_User, getSkillById);
router.post('/', verify_User, createSkill);
router.patch('/:id', verify_User, updateSkill);  // Make sure this exists
router.delete('/:id', verify_User, deleteSkill);

export default router; 
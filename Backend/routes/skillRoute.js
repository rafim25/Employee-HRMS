import express from 'express';
import {
    getSkills,
    getSkillById,
    createSkill,
    updateSkill,
    deleteSkill,
    bulkUploadSkills,
} from '../controllers/skillController.js';
import { verify_User, admin_Only } from '../middleware/AuthUser.js';

const router = express.Router();

router.get('/', verify_User, getSkills);
router.post('/bulk-upload', verify_User, admin_Only, bulkUploadSkills);
router.get('/:id', verify_User, getSkillById);
router.post('/', verify_User, createSkill);
router.patch('/:id', verify_User, updateSkill);
router.delete('/:id', verify_User, deleteSkill);

export default router; 
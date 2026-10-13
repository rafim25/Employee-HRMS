import Skill from '../models/Skill.js';
import User from '../models/User.js';
import { fn, col, where } from 'sequelize';

// Get all skills (supports ?page=&limit= for server pagination)
export const getSkills = async (req, res) => {
    try {
        const { parsePagination, paginationMeta, wantsPagination } = await import('../utils/pagination.js');
        const usePaging = wantsPagination(req.query);
        const { page, limit, offset } = parsePagination(req.query);

        if (usePaging) {
            const { rows, count } = await Skill.findAndCountAll({
                order: [['name', 'ASC']],
                limit,
                offset,
            });
            return res.json({
                data: rows,
                pagination: paginationMeta(page, limit, count),
            });
        }

        const skills = await Skill.findAll({ order: [['name', 'ASC']] });
        res.json(skills);
    } catch (error) {
        console.error('Error fetching skills:', error);
        res.status(500).json({ message: 'Failed to fetch skills', error: error.message });
    }
};

// Get a skill by ID
export const getSkillById = async (req, res) => {
    try {
        const { id } = req.params;
        const skill = await Skill.findByPk(id); // Assuming you're using Sequelize
        if (!skill) {
            return res.status(404).json({ message: 'Skill not found' });
        }
        res.json(skill);
    } catch (error) {
        console.error('Error fetching skill by ID:', error);
        res.status(500).json({ message: 'Failed to fetch skill', error: error.message });
    }
};

// Create a new skill
export const createSkill = async (req, res) => {
    try {
        const { name, description, status } = req.body; // Include description
        const newSkill = await Skill.create({ 
            name, 
            description, // Add description to creation
            status: status || 'active'
        });
        res.status(201).json(newSkill);
    } catch (error) {
        console.error('Error creating skill:', error);
        res.status(500).json({ message: 'Failed to create skill', error: error.message });
    }
};

// Update a skill
export const updateSkill = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, status } = req.body;

        const skill = await Skill.findOne({
            where: { id: id }
        });

        if (!skill) {
            return res.status(404).json({ msg: "Skill not found" });
        }

        await skill.update({
            name,
            description,
            status
        });

        res.status(200).json({ msg: "Skill updated successfully", data: skill });
    } catch (error) {
        console.error('Error updating skill:', error);
        res.status(500).json({ msg: error.message });
    }
};

// Delete a skill
export const deleteSkill = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Skill.destroy({
            where: { id },
        });
        if (!deleted) {
            return res.status(404).json({ message: 'Skill not found' });
        }
        res.json({ message: 'Skill deleted successfully' });
    } catch (error) {
        console.error('Error deleting skill:', error);
        res.status(500).json({ message: 'Failed to delete skill', error: error.message });
    }
};

const pickField = (row, keys) => {
  for (const key of keys) {
    const value = row[key];
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      return typeof value === 'string' ? value.trim() : value;
    }
  }
  return undefined;
};

export const bulkUploadSkills = async (req, res) => {
  try {
    const { skills } = req.body;
    if (!skills || !Array.isArray(skills) || skills.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid skills data provided',
      });
    }

    const sessionUser = req.user || { user_id: req.userId };
    const results = { success: [], duplicates: [], errors: [] };
    const namesInFile = new Set();

    for (const [index, rawSkill] of skills.entries()) {
      const rowNumber = index + 2;
      const name = pickField(rawSkill, ['name', 'Name', 'skill', 'Skill']);
      try {
        if (!name) {
          throw new Error('name is required.');
        }

        const statusValue = pickField(rawSkill, ['status', 'Status']) || 'active';
        const status = String(statusValue).toLowerCase();
        if (!['active', 'inactive'].includes(status)) {
          throw new Error(`Invalid status "${statusValue}". Allowed: active, inactive.`);
        }

        const creatorId = pickField(rawSkill, ['created_by_id', 'Creator_ID', 'creator_id']) || sessionUser.user_id;
        if (!creatorId) {
          throw new Error('created_by_id is required. Download the template while signed in.');
        }
        const creator = await User.findOne({ where: { user_id: String(creatorId) } });
        if (!creator) {
          throw new Error(`Creator ID "${creatorId}" does not exist in the users table.`);
        }

        const nameKey = name.toLowerCase();
        if (namesInFile.has(nameKey)) {
          results.duplicates.push({
            name,
            email: status,
            error: `Row ${rowNumber}: Skill "${name}" is duplicated in this file.`,
          });
          continue;
        }

        const existing = await Skill.findOne({
          where: where(fn('LOWER', col('name')), nameKey),
        });
        if (existing) {
          results.duplicates.push({
            name,
            email: status,
            error: `Row ${rowNumber}: Skill "${name}" already exists.`,
          });
          continue;
        }

        const created = await Skill.create({
          name,
          description: pickField(rawSkill, ['description', 'Description']) || null,
          status,
        });

        namesInFile.add(nameKey);
        results.success.push({
          name,
          email: status,
          id: created.id,
          message: `Row ${rowNumber}: Skill created. Creator ID ${creator.user_id} was validated.`,
        });
      } catch (error) {
        results.errors.push({
          name: name || `Row ${rowNumber}`,
          email: pickField(rawSkill, ['status', 'Status']) || '',
          error: `Row ${rowNumber}: ${error.message}`,
        });
      }
    }

    const message = `Processed ${skills.length} skills: ${results.success.length} successful, ${results.duplicates.length} duplicates, ${results.errors.length} errors`;
    return res.status(200).json({
      success: true,
      message,
      results,
    });
  } catch (error) {
    console.error('Bulk skill upload error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process skills',
      error: error.message,
    });
  }
}; 
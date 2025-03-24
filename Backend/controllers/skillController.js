import Skill from '../models/Skill.js';

// Get all skills
export const getSkills = async (req, res) => {
    try {
        const skills = await Skill.findAll(); // Assuming you're using Sequelize
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
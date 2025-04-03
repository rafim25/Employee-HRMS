import { Sequelize } from 'sequelize';
import db from '../config/Database.js';
import Job from './Job.js';
import Candidate from './Candidate.js';
import CandidateStatusHistory from "./CandidateStatusHistory.js";

// Remove any existing associations first
Job.associations = {};
Candidate.associations = {};
CandidateStatusHistory.associations = {};

// Define associations
Job.hasMany(Candidate, {
    foreignKey: 'job_id',
    as: 'candidates'
});

Candidate.belongsTo(Job, {
    foreignKey: 'job_id',
    as: 'job'
});

Candidate.hasMany(CandidateStatusHistory, {
    foreignKey: {
        name: 'candidate_id',
        allowNull: false
    },
    as: 'statusHistory',
    onDelete: 'CASCADE'
});

CandidateStatusHistory.belongsTo(Candidate, {
    foreignKey: {
        name: 'candidate_id',
        allowNull: false
    },
    as: 'candidate'
});

// Create sync function
const syncModels = async () => {
    try {
        await db.sync({ alter: true });
        console.log("✅ All tables synchronized");
    } catch (error) {
        console.error("❌ Error synchronizing tables:", error);
        throw error;
    }
};

export {
    Job,
    Candidate,
    CandidateStatusHistory,
    syncModels
};
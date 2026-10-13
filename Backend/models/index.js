import { Sequelize } from 'sequelize';
import db from '../config/Database.js';
import Job from './Job.js';
import Candidate from './Candidate.js';
import CandidateStatusHistory from "./CandidateStatusHistory.js";
import User from "./User.js";
import State from "./State.js";
import City from "./City.js";
import * as HrModels from "./hr/index.js";

// Remove any existing associations first
Job.associations = {};
Candidate.associations = {};
CandidateStatusHistory.associations = {};
State.associations = {};
City.associations = {};

// Define associations
Job.belongsTo(User, {
    foreignKey: 'created_by_id',
    as: 'creator'
});

User.hasMany(Job, {
    foreignKey: 'created_by_id',
    as: 'jobs'
});

Job.hasMany(Candidate, {
    foreignKey: 'job_id',
    as: 'candidates'
});

Candidate.belongsTo(Job, {
    foreignKey: 'job_id',
    as: 'job'
});

Candidate.belongsTo(User, {
    foreignKey: 'created_by_id',
    as: 'creator'
});

User.hasMany(Candidate, {
    foreignKey: 'created_by_id',
    as: 'candidates'
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

State.hasMany(City, {
    foreignKey: 'state_id',
    as: 'cities',
    onDelete: 'CASCADE',
});

City.belongsTo(State, {
    foreignKey: 'state_id',
    as: 'state',
});

// Create sync function
// Avoid alter:true on every boot — MySQL maxes out at 64 indexes/table and
// Sequelize repeatedly recreates UNIQUE constraints (uuid_N, email_N, ...).
const syncModels = async () => {
    try {
        await db.sync();
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
    syncModels,
    User,
    State,
    City,
    HrModels,
};
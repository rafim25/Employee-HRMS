import User from './User.js';   
import Jobs from './JobModel.js';
import Candidates from './CandidateModel.js';

const setupAssociations = () => {
    // User associations
    User.hasMany(Jobs, {
        foreignKey: 'created_by_id',
        as: 'jobs'
    });

    User.hasMany(Candidates, {
        foreignKey: 'created_by_id',
        as: 'candidates'
    });

    // Job associations
    Jobs.belongsTo(User, {
        foreignKey: 'created_by_id',
        as: 'creator'
    });

    Jobs.hasMany(Candidates, {
        foreignKey: 'job_id',
        as: 'candidates'
    });

    // Candidate associations
    Candidates.belongsTo(Jobs, {
        foreignKey: 'job_id',
        as: 'job'
    });

    Candidates.belongsTo(User, {
        foreignKey: 'created_by_id',
        as: 'creator'
    });
};

export default setupAssociations; 
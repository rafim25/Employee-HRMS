import { DataTypes } from 'sequelize';
import db from '../config/Database.js';

const CandidateStatusHistory = db.define('candidate_status_histories', {
    uuid: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        unique: true
    },
    candidate_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('applied', 'screening', 'shortlisted', 'interviewed', 'selected', 'rejected'),
        allowNull: false
    },
    changed_by: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    changed_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    freezeTableName: true,
    timestamps: false
});

export default CandidateStatusHistory; 
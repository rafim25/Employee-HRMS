import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const CandidateStatusHistory = db.define('candidate_status_histories', {
    uuid: {
        type: Sequelize.STRING,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        unique: true
    },
    candidate_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    status: {
        type: Sequelize.ENUM('applied', 'screening', 'shortlisted', 'interviewed', 'selected', 'rejected'),
        allowNull: false
    },
    changed_by: {
        type: Sequelize.STRING,
        allowNull: false
    },
    changed_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    },
    notes: {
        type: Sequelize.TEXT,
        allowNull: true
    }
}, {
    timestamps: true
});

export default CandidateStatusHistory; 
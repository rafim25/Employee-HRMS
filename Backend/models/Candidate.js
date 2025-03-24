import { DataTypes, Sequelize } from 'sequelize';
import db from '../config/Database.js';

const Candidate = db.define('candidates', {
    uuid: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        unique: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    experience: {
        type: DataTypes.DECIMAL(10, 1),
        allowNull: true
    },
    current_company: {
        type: DataTypes.STRING,
        allowNull: true
    },
    current_ctc: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    expected_ctc: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    notice_period: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    current_location: {
        type: DataTypes.STRING,
        allowNull: true
    },
    preferred_location: {
        type: DataTypes.STRING,
        allowNull: true
    },
    resume_url: {
        type: DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('applied', 'screening', 'shortlisted', 'interviewed', 'selected', 'rejected'),
        defaultValue: 'applied'
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    job_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    source: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'Direct'
    },
    referred_by: {
        type: DataTypes.STRING,
        allowNull: true
    },
    skills: {
        type: DataTypes.TEXT,
        allowNull: true,
        get() {
            const value = this.getDataValue('skills');
            return value ? JSON.parse(value) : [];
        },
        set(value) {
            this.setDataValue('skills', JSON.stringify(value));
        }
    },
    interview_feedback: {
        type: DataTypes.TEXT,
        allowNull: true,
        get() {
            const value = this.getDataValue('interview_feedback');
            return value ? JSON.parse(value) : [];
        },
        set(value) {
            this.setDataValue('interview_feedback', JSON.stringify(value));
        }
    },
    education: {
        type: DataTypes.TEXT,
        allowNull: true,
        get() {
            const value = this.getDataValue('education');
            return value ? JSON.parse(value) : [];
        },
        set(value) {
            this.setDataValue('education', JSON.stringify(value));
        }
    },
    documents: {
        type: DataTypes.TEXT,
        allowNull: true,
        get() {
            const value = this.getDataValue('documents');
            return value ? JSON.parse(value) : [];
        },
        set(value) {
            this.setDataValue('documents', JSON.stringify(value));
        }
    },
    current_round: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    interview_schedule: {
        type: DataTypes.TEXT,
        allowNull: true,
        get() {
            const value = this.getDataValue('interview_schedule');
            return value ? JSON.parse(value) : [];
        },
        set(value) {
            this.setDataValue('interview_schedule', JSON.stringify(value));
        }
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
    }
}, {
    freezeTableName: true,
    timestamps: true,
});

export default Candidate; 
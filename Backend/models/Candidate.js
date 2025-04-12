import { DataTypes, Sequelize } from 'sequelize';
import db from '../config/Database.js';
import User from "./User.js";
import Job from '../models/Job.js';

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
        allowNull: true,
        get() {
            const rawValue = this.getDataValue('resume_url');
            return rawValue ? rawValue : null;
        }
    },
    application_status: {
        type: Sequelize.ENUM('applied', 'screening', 'shortlisted', 'interviewed', 'selected', 'rejected'),
        allowNull: false,
        defaultValue: 'applied'
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    job_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'jobs',
            key: 'id'
        }
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
    created_by: {
        type: DataTypes.STRING,
        allowNull: false
    },
    created_by_id: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'users',
            key: 'user_id'
        }
    },
    job_answers: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: {}
    },
    rejection_reason: {
        type: Sequelize.STRING,
        allowNull: true
    },
    rejection_details: {
        type: Sequelize.JSON,
        allowNull: true
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

// Define the association with User model
Candidate.belongsTo(User, {
    foreignKey: 'created_by_id',
    as: 'creator'
});

// Define the association with Job model
Candidate.belongsTo(Job, {
    foreignKey: 'job_id',
    as: 'job'
});

// Updated sync function with foreign key constraints
const syncNewColumns = async () => {
    try {
        await db.query(`
            ALTER TABLE candidates 
            ADD COLUMN IF NOT EXISTS created_by VARCHAR(255),
            ADD COLUMN IF NOT EXISTS created_by_id VARCHAR(255),
            ADD CONSTRAINT fk_created_by_id 
                FOREIGN KEY (created_by_id) 
                REFERENCES users(user_id) 
                ON DELETE SET NULL 
                ON UPDATE CASCADE,
            ADD CONSTRAINT fk_created_by_name 
                FOREIGN KEY (created_by) 
                REFERENCES users(username) 
                ON DELETE SET NULL 
                ON UPDATE CASCADE,
            ADD COLUMN IF NOT EXISTS job_answers TEXT,
            ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
            ADD COLUMN IF NOT EXISTS rejection_details TEXT;
        `);
        console.log('Added created_by columns with foreign key constraints and job answers and rejection fields successfully');
    } catch (error) {
        console.error('Error syncing new columns:', error);
    }
};

// syncNewColumns();

export default Candidate; 
// Backend/models/Job.js
import { DataTypes, Sequelize } from 'sequelize';
import db from '../config/Database.js';

const Job = db.define('jobs', {
    uuid: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    state: {
        type: DataTypes.STRING,
        allowNull: true
    },
    city: {
        type: DataTypes.STRING,
        allowNull: true
    },
    minSalary: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    maxSalary: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('active', 'archived', 'draft', 'closed', 'expired'),
        defaultValue: 'active'
    },
    questions: {
        type: DataTypes.TEXT,
        allowNull: true,
        get() {
            const value = this.getDataValue('questions');
            return value ? JSON.parse(value) : [];
        },
        set(value) {
            this.setDataValue('questions', JSON.stringify(value));
        }
    },
    deadline: {
        type: DataTypes.DATE,
    },
    experienceRange: {
        type: DataTypes.TEXT,
        allowNull: true,
        get() {
            const value = this.getDataValue('experienceRange');
            return value ? JSON.parse(value) : [0, 10];
        },
        set(value) {
            this.setDataValue('experienceRange', JSON.stringify(value));
        }
    },
    interviewRounds: {
        type: DataTypes.TEXT,
        allowNull: true,
        get() {
            const value = this.getDataValue('interviewRounds');
            return value ? JSON.parse(value) : [];
        },
        set(value) {
            this.setDataValue('interviewRounds', JSON.stringify(value));
        }
    },
    clientName: {
        type: DataTypes.STRING,
    },
    clientEmail: {
        type: DataTypes.STRING,
        validate: {
            isEmail: true,
        },
    },
    clientLocation: {
        type: DataTypes.STRING,
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
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
    },
}, {
    freezeTableName: true,
    timestamps: true,
});

(async () => {
    try {
        await Job.sync({ force: true });
        console.log("✅ Jobs table synchronized");
    } catch (error) {
        console.error("❌ Error synchronizing Jobs table:", error);
    }
})();

export default Job;
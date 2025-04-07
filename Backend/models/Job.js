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
        type: DataTypes.ENUM('active', 'draft', 'closed', 'archived', 'expired'),
        defaultValue: 'draft',
        allowNull: false
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
    created_by: {
        type: DataTypes.STRING,
        allowNull: true,
        references: {
            model: 'users',
            key: 'username'
        }
    },
    created_by_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'users',
            key: 'user_id'
        }
    },
    updated_by: {
        type: DataTypes.STRING,
        allowNull: true,
        references: {
            model: 'users',
            key: 'username'
        }
    },
    updated_by_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'users',
            key: 'user_id'
        }
    },
}, {
    freezeTableName: true,
    timestamps: true,
});

Job.associate = (models) => {
    Job.belongsTo(models.User, {
        foreignKey: 'created_by_id',
        as: 'creator'
    });
    Job.belongsTo(models.User, {
        foreignKey: 'updated_by_id',
        as: 'updater'
    });
};

const syncNewColumns = async () => {
    try {
        await db.query(`
            ALTER TABLE jobs 
            ADD COLUMN IF NOT EXISTS created_by VARCHAR(255),
            ADD COLUMN IF NOT EXISTS created_by_id INT,
            ADD COLUMN IF NOT EXISTS updated_by VARCHAR(255),
            ADD COLUMN IF NOT EXISTS updated_by_id INT,
            ADD CONSTRAINT fk_job_created_by_id 
                FOREIGN KEY (created_by_id) 
                REFERENCES users(user_id) 
                ON DELETE SET NULL 
                ON UPDATE CASCADE,
            ADD CONSTRAINT fk_job_created_by_name 
                FOREIGN KEY (created_by) 
                REFERENCES users(username) 
                ON DELETE SET NULL 
                ON UPDATE CASCADE,
            ADD CONSTRAINT fk_job_updated_by_id 
                FOREIGN KEY (updated_by_id) 
                REFERENCES users(user_id) 
                ON DELETE SET NULL 
                ON UPDATE CASCADE,
            ADD CONSTRAINT fk_job_updated_by_name 
                FOREIGN KEY (updated_by) 
                REFERENCES users(username) 
                ON DELETE SET NULL 
                ON UPDATE CASCADE
        `);
        console.log('Added created_by and updated_by columns with foreign key constraints successfully');
    } catch (error) {
        console.error('Error syncing new columns:', error);
    }
};

syncNewColumns();

(async () => {
    try {
        await Job.sync({ force: true });
        console.log("✅ Jobs table synchronized");
    } catch (error) {
        console.error("❌ Error synchronizing Jobs table:", error);
    }
})();

export default Job;
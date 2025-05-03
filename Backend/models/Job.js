// Backend/models/Job.js
import { DataTypes, Sequelize } from 'sequelize';
import db from '../config/Database.js';

const Job = db.define('jobs', {
    uuid: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        unique: true
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
    openings: {  // Added openings field
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
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
    created_by_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    created_by: {
        type: DataTypes.STRING,
        allowNull: false
    },
    updated_by: {
        type: DataTypes.STRING,
        allowNull: true
    },
    updated_by_id: {
        type: DataTypes.STRING,
        allowNull: true
    },
    editable_by: {
        type: DataTypes.TEXT,
        allowNull: true,
        get() {
            const value = this.getDataValue('editable_by');
            return value ? JSON.parse(value) : [];
        },
        set(value) {
            this.setDataValue('editable_by', JSON.stringify(value));
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
        console.log('Starting to sync new columns...');
        await db.query('SET FOREIGN_KEY_CHECKS = 0');

        // First, check the type of user_id in users table
        const [userColumns] = await db.query(`
            SHOW COLUMNS FROM users WHERE Field = 'user_id'
        `);
        
        // Add or modify columns with correct types
        const columnsToAdd = [
            { name: 'created_by', type: 'VARCHAR(255)' },
            // Make created_by_id match the users.user_id type
            { name: 'created_by_id', type: 'VARCHAR(255)' },
            { name: 'updated_by', type: 'VARCHAR(255)' },
            { name: 'updated_by_id', type: 'VARCHAR(255)' },
            { name: 'openings', type: 'INT NOT NULL DEFAULT 1' }
        ];

        // Drop existing foreign keys if they exist
        const [constraints] = await db.query(`
            SELECT CONSTRAINT_NAME
            FROM information_schema.KEY_COLUMN_USAGE
            WHERE TABLE_NAME = 'jobs'
            AND REFERENCED_TABLE_NAME IS NOT NULL
        `);

        for (const constraint of constraints) {
            await db.query(`
                ALTER TABLE jobs
                DROP FOREIGN KEY ${constraint.CONSTRAINT_NAME}
            `);
        }

        // Modify or add columns
        for (const column of columnsToAdd) {
            await db.query(`
                ALTER TABLE jobs 
                MODIFY COLUMN IF EXISTS ${column.name} ${column.type},
                ADD COLUMN IF NOT EXISTS ${column.name} ${column.type}
            `);
            console.log(`Modified/Added column: ${column.name}`);
        }

        // Add foreign key constraints
        console.log('Adding foreign key constraints...');
        await db.query(`
            ALTER TABLE jobs
            ADD CONSTRAINT fk_job_created_by_id 
            FOREIGN KEY (created_by_id) 
            REFERENCES users(user_id)
            ON DELETE SET NULL
            ON UPDATE CASCADE
        `);

        await db.query('SET FOREIGN_KEY_CHECKS = 1');
        
        console.log('✅ Successfully synced all columns and constraints');
    } catch (error) {
        console.error('❌ Error syncing columns:', error);
        console.error('Error details:', error.original || error);
        throw error;
    }
};

// Immediately invoke the sync function with proper error handling
// (async () => {
//     try {
//         console.log('Starting database synchronization...');
//         await syncNewColumns();
//         console.log('✅ Database synchronization complete');
//     } catch (error) {
//         console.error('❌ Database synchronization failed:', error);
//         console.error(error);
//     }
// })();

export default Job;
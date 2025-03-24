import db from "./Database.js";
import Job from "../models/Job.js";
import Skill from "../models/Skill.js";

const initializeDatabase = async () => {
  try {
    await db.authenticate();
    console.log('✅ Database connected successfully');

    // Create jobs table if it doesn't exist
    await db.query(`
      CREATE TABLE IF NOT EXISTS jobs (
        id INT NOT NULL AUTO_INCREMENT,
        uuid VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        type VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        questions JSON,
        state VARCHAR(255),
        city VARCHAR(255),
        minSalary INT,
        maxSalary INT,
        deadline DATETIME,
        experienceRange JSON,
        interviewRounds JSON,
        clientName VARCHAR(255),
        clientEmail VARCHAR(255),
        clientLocation VARCHAR(255),
        skills JSON,
        status VARCHAR(255) NOT NULL DEFAULT 'draft',
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    
    // Create skills table if it doesn't exist
    await db.query(`
      CREATE TABLE IF NOT EXISTS skills (
        id INT NOT NULL AUTO_INCREMENT,
        uuid VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        status VARCHAR(255) NOT NULL DEFAULT 'active',
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    
    console.log('✅ Tables created successfully');

  } catch (error) {
    console.error('❌ Database initialization error:', error);
    throw error;
  }
};

export default initializeDatabase; 
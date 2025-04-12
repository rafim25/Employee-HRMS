import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const db = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER_NAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false, // Disable logging
    dialectOptions: {
      connectTimeout: parseInt(process.env.DB_TIMEOUT)
    },
    pool: {
      max: parseInt(process.env.DB_CONNECTION_LIMIT),
      min: 0,
      acquire: 60000,
      idle: 10000
    }
  }
);

// Simple connection test
const testConnection = async () => {
  try {
    await db.authenticate();
    console.log('✅ Database connection has been established successfully.');
    return true;
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    throw error;
  }
};

export { db as default, testConnection };

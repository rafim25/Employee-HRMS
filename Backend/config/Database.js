import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables if not already loaded
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
dotenv.config({ 
  path: path.join(__dirname, '..', envFile)
});

// Database configuration
const database = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER_NAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: {
      connectTimeout: 60000,
      ssl: {
        rejectUnauthorized: false
      }
    }
  }
);

// Test connection function
const testConnection = async () => {
  try {
    await database.authenticate();
    console.log('✅ Database connection established successfully');
    return true;
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    throw error;
  }
};

// Export both database and testConnection
export { database as default, testConnection };

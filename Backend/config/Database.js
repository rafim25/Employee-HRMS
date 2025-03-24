import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const db = new Sequelize(
  process.env.DB_NAME || 'db_penggajian3',
  process.env.DB_USERNAME || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    dialectOptions: {
      connectTimeout: 60000,
      ssl: {
        rejectUnauthorized: false,
      },
    },
  }
);

// Test the connection
export const testConnection = async () => {
  try {
    await db.authenticate();
    console.log("✅ Database connection has been established successfully.");
    console.log(
      `🔌 Connected to DB: ${process.env.DB_NAME} on port ${process.env.DB_PORT}`
    );
    return true;
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
    return false;
  }
};

export default db;

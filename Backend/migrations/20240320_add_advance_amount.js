import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const migration = {
  up: async () => {
    try {
      await db.query(`
        ALTER TABLE loans 
        ADD COLUMN advance_amount DECIMAL(12,2) NOT NULL DEFAULT 0
      `);
      console.log("Migration: Added advance_amount column to loans table");
    } catch (error) {
      console.error("Migration failed:", error);
      throw error;
    }
  },

  down: async () => {
    try {
      await db.query(`
        ALTER TABLE loans 
        DROP COLUMN advance_amount
      `);
      console.log("Migration: Removed advance_amount column from loans table");
    } catch (error) {
      console.error("Migration failed:", error);
      throw error;
    }
  },
};

export default migration;

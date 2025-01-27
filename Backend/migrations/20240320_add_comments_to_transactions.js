import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const migration = {
  up: async () => {
    try {
      await db.query(`
        ALTER TABLE transactions
        ADD COLUMN comments TEXT;
      `);
      console.log("Migration: Added comments column to transactions table");
    } catch (error) {
      console.error("Migration failed:", error);
      throw error;
    }
  },

  down: async () => {
    try {
      await db.query(`
        ALTER TABLE transactions
        DROP COLUMN comments;
      `);
      console.log("Migration: Removed comments column from transactions table");
    } catch (error) {
      console.error("Migration failed:", error);
      throw error;
    }
  },
};

export default migration;

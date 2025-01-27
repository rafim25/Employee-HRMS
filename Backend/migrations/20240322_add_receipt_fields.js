import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const migration = {
  up: async () => {
    try {
      await db.query(`
        ALTER TABLE transactions
        ADD COLUMN receipt VARCHAR(255),
        ADD COLUMN receipt_url VARCHAR(255);
      `);
      console.log("Migration: Added receipt fields to transactions table");
    } catch (error) {
      console.error("Migration failed:", error);
      throw error;
    }
  },

  down: async () => {
    try {
      await db.query(`
        ALTER TABLE transactions
        DROP COLUMN receipt,
        DROP COLUMN receipt_url;
      `);
      console.log("Migration: Removed receipt fields from transactions table");
    } catch (error) {
      console.error("Migration failed:", error);
      throw error;
    }
  },
};

export default migration;

import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const migration = {
  up: async () => {
    try {
      // Drop existing new tables if they exist
      await db.query(`DROP TABLE IF EXISTS transactions_new;`);
      await db.query(`DROP TABLE IF EXISTS loans_new;`);

      // Create new loans table with string loan_id
      await db.query(`
        CREATE TABLE loans_new (
          loan_id VARCHAR(255) NOT NULL PRIMARY KEY,
          customer_id VARCHAR(255) NOT NULL,
          customer_name VARCHAR(255) NOT NULL,
          loan_amount DECIMAL(12,2) NOT NULL,
          advance_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
          remaining_balance DECIMAL(12,2) NOT NULL,
          status ENUM('active', 'closed') NOT NULL DEFAULT 'active',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (customer_id) REFERENCES users(user_id)
        );
      `);

      // Create new transactions table with updated schema
      await db.query(`
        CREATE TABLE transactions_new (
          transaction_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
          loan_id VARCHAR(255) NOT NULL,
          customer_id VARCHAR(255) NOT NULL,
          admin_id VARCHAR(255) NOT NULL,
          amount DECIMAL(10,2) NOT NULL,
          transaction_type ENUM('credit', 'debit') NOT NULL,
          comments TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (loan_id) REFERENCES loans_new(loan_id),
          FOREIGN KEY (customer_id) REFERENCES users(user_id),
          FOREIGN KEY (admin_id) REFERENCES users(user_id)
        );
      `);

      // Create default admin user if not exists
      await db.query(`
        INSERT IGNORE INTO users (user_id, username, email, password, gender, role, status)
        VALUES ('ADMIN_DEFAULT', 'system_admin', 'system@admin.com', 'not_used', 'Other', 'Admin', 'active');
      `);

      // Copy data from old loans table to new loans table
      await db.query(`
        INSERT INTO loans_new (loan_id, customer_id, customer_name, loan_amount, advance_amount, remaining_balance, status, created_at, updated_at)
        SELECT 
          CASE 
            WHEN loan_id LIKE 'LN%' THEN loan_id
            ELSE CONCAT('LN', LPAD(loan_id, 9, '0'))
          END,
          CASE 
            WHEN customer_id IS NULL OR customer_id = '' THEN 'ADMIN_DEFAULT'
            ELSE customer_id 
          END,
          customer_name, 
          loan_amount, 
          advance_amount, 
          remaining_balance, 
          status, 
          created_at, 
          updated_at
        FROM loans;
      `);

      // Copy data from old transactions table to new transactions table
      await db.query(`
        INSERT INTO transactions_new (transaction_id, loan_id, customer_id, admin_id, amount, transaction_type, comments, created_at)
        SELECT 
          transaction_id, 
          CASE 
            WHEN loan_id LIKE 'LN%' THEN loan_id
            ELSE CONCAT('LN', LPAD(loan_id, 9, '0'))
          END,
          CASE 
            WHEN customer_id IS NULL OR customer_id = '' THEN 'ADMIN_DEFAULT'
            ELSE customer_id 
          END,
          CASE 
            WHEN admin_id IS NULL OR admin_id = '' THEN 'ADMIN_DEFAULT'
            ELSE admin_id 
          END,
          amount, 
          transaction_type, 
          comments, 
          created_at
        FROM transactions;
      `);

      // Drop old tables
      await db.query(`DROP TABLE transactions;`);
      await db.query(`DROP TABLE loans;`);

      // Rename new tables to original names
      await db.query(`RENAME TABLE loans_new TO loans;`);
      await db.query(`RENAME TABLE transactions_new TO transactions;`);

      console.log("Migration: Updated loan_id column type to VARCHAR(255)");
    } catch (error) {
      console.error("Migration failed:", error);
      throw error;
    }
  },

  down: async () => {
    try {
      // Create old tables with INT loan_id
      await db.query(`
        CREATE TABLE loans_old (
          loan_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
          customer_id VARCHAR(255) NOT NULL,
          customer_name VARCHAR(255) NOT NULL,
          loan_amount DECIMAL(12,2) NOT NULL,
          advance_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
          remaining_balance DECIMAL(12,2) NOT NULL,
          status ENUM('active', 'closed') NOT NULL DEFAULT 'active',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (customer_id) REFERENCES users(user_id)
        );
      `);

      await db.query(`
        CREATE TABLE transactions_old (
          transaction_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
          loan_id INT NOT NULL,
          customer_id INT NOT NULL,
          admin_id INT NOT NULL,
          amount DECIMAL(10,2) NOT NULL,
          transaction_type ENUM('credit', 'debit') NOT NULL,
          comments TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (loan_id) REFERENCES loans_old(loan_id),
          FOREIGN KEY (customer_id) REFERENCES users(user_id),
          FOREIGN KEY (admin_id) REFERENCES users(user_id)
        );
      `);

      // Copy data back to old format tables
      await db.query(`
        INSERT INTO loans_old (customer_id, customer_name, loan_amount, advance_amount, remaining_balance, status, created_at, updated_at)
        SELECT customer_id, customer_name, loan_amount, advance_amount, remaining_balance, status, created_at, updated_at
        FROM loans;
      `);

      await db.query(`
        INSERT INTO transactions_old (transaction_id, loan_id, customer_id, admin_id, amount, transaction_type, comments, created_at)
        SELECT transaction_id, CAST(SUBSTRING(loan_id, 3) AS UNSIGNED), customer_id, admin_id, amount, transaction_type, comments, created_at
        FROM transactions;
      `);

      // Drop new tables
      await db.query(`DROP TABLE transactions;`);
      await db.query(`DROP TABLE loans;`);

      // Rename old tables to original names
      await db.query(`RENAME TABLE loans_old TO loans;`);
      await db.query(`RENAME TABLE transactions_old TO transactions;`);

      console.log("Migration: Reverted loan_id column type to INT");
    } catch (error) {
      console.error("Migration failed:", error);
      throw error;
    }
  },
};

export default migration;

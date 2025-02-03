import db from "./config/Database.js";

const alterTable = async () => {
  try {
    // Get foreign key information
    const [fkInfo] = await db.query(`
      SELECT CONSTRAINT_NAME
      FROM information_schema.KEY_COLUMN_USAGE
      WHERE TABLE_NAME = 'expenses'
      AND REFERENCED_TABLE_NAME = 'users'
      AND CONSTRAINT_SCHEMA = DATABASE();
    `);

    if (fkInfo && fkInfo.length > 0) {
      // Drop the existing foreign key constraint
      await db.query(
        `ALTER TABLE expenses DROP FOREIGN KEY ${fkInfo[0].CONSTRAINT_NAME}`
      );
    }

    // Alter the column type
    await db.query(
      "ALTER TABLE expenses MODIFY COLUMN userId VARCHAR(255) NOT NULL"
    );

    // Add the foreign key constraint back with the correct reference
    await db.query(`
      ALTER TABLE expenses 
      ADD CONSTRAINT FK_expense_user
      FOREIGN KEY (userId) 
      REFERENCES users(user_id)
    `);

    console.log("Successfully altered userId column type to VARCHAR");
    process.exit(0);
  } catch (error) {
    console.error("Error altering table:", error);
    process.exit(1);
  }
};

alterTable();

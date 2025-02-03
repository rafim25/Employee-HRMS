import { up as migration_20240322_up } from "./migrations/20240322_add_receipt_fields.js";
import { up as migration_20240320_up } from "./migrations/20240320_create_expenses_table.js";
import { up as migration_20240323_up } from "./migrations/20240323_alter_expense_userid.js";

const runMigrations = async () => {
  try {
    // Run migrations in sequence
    console.log("Starting migrations...");

    // Create expenses table migration
    await migration_20240320_up();

    // Add receipt fields migration
    await migration_20240322_up();

    // Alter userId column type
    await migration_20240323_up();

    console.log("All migrations completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
};

runMigrations();

import migration_20240320_loan_id from "./20240320_update_loan_id_type.js";

const runMigrations = async () => {
  try {
    console.log("Starting migrations...");

    // Run migrations in sequence
    await migration_20240320_loan_id.up();

    console.log("All migrations completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
};

runMigrations();

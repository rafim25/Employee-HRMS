import migration_20240322 from "./migrations/20240322_add_receipt_fields.js";

const runMigrations = async () => {
  try {
    // Run migrations in sequence
    console.log("Starting migrations...");

    // Add receipt fields migration
    await migration_20240322.up();

    console.log("All migrations completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
};

runMigrations();

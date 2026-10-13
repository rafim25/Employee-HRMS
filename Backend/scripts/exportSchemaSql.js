/**
 * Export current MySQL schema (SHOW CREATE TABLE) to Backend/db/schema.sql
 *
 * Usage (after tables exist):
 *   NODE_ENV=production node scripts/exportSchemaSql.js
 *   npm run db:export-schema
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envFile = process.env.NODE_ENV === "production" ? ".env.production" : ".env";
dotenv.config({ path: path.join(__dirname, "..", envFile) });

const APP_TABLES = [
  "users",
  "jobs",
  "candidates",
  "candidate_status_histories",
  "skills",
  "states",
  "cities",
  "loans",
  "expenses",
  "transactions",
  "data_pegawai",
  "data_jabatan",
  "data_kehadiran",
  "potongan_gaji",
  "sessions",
  "org_settings",
  "attendance_policies",
  "working_day_configs",
  "authorized_locations",
  "holidays",
  "leave_types",
  "leave_policies",
  "leave_balances",
  "leave_requests",
  "attendance_logs",
  "salary_components",
  "employee_profiles",
  "employee_salary_structures",
  "employee_salary_components",
  "payroll_runs",
  "salary_slips",
  "employee_documents",
  "notifications",
  "audit_logs",
];

async function main() {
  const { default: db } = await import("../config/Database.js");
  await db.authenticate();

  const dbName = process.env.DB_NAME;
  const outDir = path.join(__dirname, "..", "db");
  const outFile = path.join(outDir, "schema.sql");
  fs.mkdirSync(outDir, { recursive: true });

  const [existingRows] = await db.query(
    `SELECT table_name AS name
     FROM information_schema.tables
     WHERE table_schema = :dbName
     ORDER BY table_name`,
    { replacements: { dbName } }
  );

  const existing = new Set(
    (existingRows || []).map((r) => String(r.name || r.NAME || r.table_name || "").toLowerCase())
  );

  const tables = APP_TABLES.filter((t) => existing.has(t.toLowerCase()));
  const extras = [...existing].filter((t) => !APP_TABLES.map((x) => x.toLowerCase()).includes(t));

  const lines = [
    "-- Employee HRMS schema export",
    `-- Generated: ${new Date().toISOString()}`,
    `-- Database: ${dbName}`,
    "-- Source: SHOW CREATE TABLE (via scripts/exportSchemaSql.js)",
    "",
    "SET NAMES utf8mb4;",
    "SET FOREIGN_KEY_CHECKS = 0;",
    "",
    `CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`,
    `USE \`${dbName}\`;`,
    "",
  ];

  for (const table of tables) {
    const [rows] = await db.query(`SHOW CREATE TABLE \`${table}\``);
    const createSql = rows?.[0]?.["Create Table"] || rows?.[0]?.["Create Table".toLowerCase()];
    if (!createSql) {
      console.warn("Skip (no CREATE):", table);
      continue;
    }
    lines.push(`-- ----------------------------`);
    lines.push(`-- Table: ${table}`);
    lines.push(`-- ----------------------------`);
    lines.push(`DROP TABLE IF EXISTS \`${table}\`;`);
    lines.push(`${createSql};`);
    lines.push("");
    console.log("Exported:", table);
  }

  if (extras.length) {
    lines.push("-- Other tables present in schema (not in app inventory):");
    for (const table of extras.sort()) {
      const [rows] = await db.query(`SHOW CREATE TABLE \`${table}\``);
      const createSql = rows?.[0]?.["Create Table"] || rows?.[0]?.["Create Table".toLowerCase()];
      if (!createSql) continue;
      lines.push(`-- ${table}`);
      lines.push(`DROP TABLE IF EXISTS \`${table}\`;`);
      lines.push(`${createSql};`);
      lines.push("");
      console.log("Exported (extra):", table);
    }
  }

  lines.push("SET FOREIGN_KEY_CHECKS = 1;");
  lines.push("");

  fs.writeFileSync(outFile, lines.join("\n"), "utf8");
  console.log(`\n✅ Wrote ${outFile}`);
  console.log(`   App tables exported: ${tables.length}`);
  if (tables.length < APP_TABLES.length) {
    const missing = APP_TABLES.filter((t) => !existing.has(t.toLowerCase()));
    console.log("   Missing (run npm run db:setup first):", missing.join(", "));
  }

  await db.close();
}

main().catch((err) => {
  console.error("❌ exportSchemaSql failed:", err.message || err);
  process.exit(1);
});

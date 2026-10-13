/**
 * Idempotent index creation for large list queries (candidates, jobs, users).
 * Run: node scripts/ensureListIndexes.js
 */
import db from "../config/Database.js";

export const LIST_INDEX_STATEMENTS = [
  "CREATE INDEX candidates_created_at_idx ON candidates (createdAt)",
  "CREATE INDEX candidates_status_idx ON candidates (application_status)",
  "CREATE INDEX candidates_created_by_idx ON candidates (created_by_id)",
  "CREATE INDEX candidates_job_id_idx ON candidates (job_id)",
  "CREATE INDEX candidates_source_idx ON candidates (source)",
  "CREATE INDEX jobs_created_at_idx ON jobs (createdAt)",
  "CREATE INDEX jobs_status_idx ON jobs (status)",
  "CREATE INDEX users_status_role_idx ON users (status, role)",
  "CREATE INDEX users_date_joined_idx ON users (date_joined)",
];

/**
 * @param {import('sequelize').Sequelize} sequelize
 * @param {{ close?: boolean }} [options]
 */
export async function ensureListIndexes(sequelize = db, options = {}) {
  const { close = false } = options;
  for (const sql of LIST_INDEX_STATEMENTS) {
    try {
      await sequelize.query(sql);
      console.log("OK:", sql);
    } catch (err) {
      if (
        String(err?.original?.code || err?.parent?.code || "").includes("ER_DUP_KEYNAME") ||
        String(err.message || "").toLowerCase().includes("duplicate")
      ) {
        console.log("Skip (exists):", sql);
      } else {
        console.warn("Warn:", sql, "-", err.message);
      }
    }
  }
  if (close) {
    await sequelize.close();
    console.log("Done ensuring list indexes.");
  }
}

const isDirectRun =
  process.argv[1] &&
  (process.argv[1].endsWith("ensureListIndexes.js") ||
    process.argv[1].includes("ensureListIndexes"));

if (isDirectRun) {
  ensureListIndexes(db, { close: true }).catch((e) => {
    console.error(e);
    process.exit(1);
  });
}

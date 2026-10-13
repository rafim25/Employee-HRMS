/**
 * Production / fresh-environment database bootstrap.
 *
 * Creates the database (if missing), syncs all Sequelize tables + sessions,
 * ensures list indexes, and seeds admin + HR defaults.
 *
 * Usage:
 *   NODE_ENV=production node scripts/setupProductionDb.js
 *   npm run db:setup
 *
 * Requires DB_* vars in .env.production (or .env when NODE_ENV !== production).
 */
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { Sequelize } from "sequelize";
import session from "express-session";
import SequelizeStoreFactory from "connect-session-sequelize";
import argon2 from "argon2";
import { v4 as uuidv4 } from "uuid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envFile = process.env.NODE_ENV === "production" ? ".env.production" : ".env";
dotenv.config({ path: path.join(__dirname, "..", envFile) });

const {
  DB_HOST = "127.0.0.1",
  DB_PORT = "3306",
  DB_USER_NAME,
  DB_PASSWORD,
  DB_NAME,
  DB_SSL,
} = process.env;

if (!DB_USER_NAME || !DB_NAME) {
  console.error("❌ DB_USER_NAME and DB_NAME are required in", envFile);
  process.exit(1);
}

const dialectOptions = {
  connectTimeout: 60000,
  ...(DB_SSL === "true" ? { ssl: { rejectUnauthorized: false } } : {}),
};

const baseConfig = {
  host: DB_HOST,
  port: parseInt(DB_PORT, 10) || 3306,
  dialect: "mysql",
  logging: false,
  dialectOptions,
};

async function createDatabaseIfNeeded() {
  const admin = new Sequelize("", DB_USER_NAME, DB_PASSWORD || "", baseConfig);
  try {
    await admin.authenticate();
    await admin.query(
      `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    console.log(`✅ Database ready: ${DB_NAME}`);
  } finally {
    await admin.close();
  }
}

async function seedAdmin(User) {
  const username = "admin";
  const password = "Admin@123";
  const existing = await User.findOne({ where: { username } });

  if (existing) {
    existing.password = await argon2.hash(password);
    existing.role = "admin";
    existing.status = "active";
    await existing.save();
    console.log("✅ Admin user updated (username: admin)");
  } else {
    await User.create({
      uuid: uuidv4(),
      user_id: "ADM001",
      name: "Local Admin",
      username,
      email: "admin@localhost",
      password: await argon2.hash(password),
      gender: "other",
      role: "admin",
      status: "active",
      permissions: JSON.stringify([]),
    });
    console.log("✅ Admin user created (username: admin)");
  }
}

async function seedHrDefaults(Hr) {
  const {
    AttendancePolicy,
    WorkingDayConfig,
    AuthorizedLocation,
    LeaveType,
    LeavePolicy,
    SalaryComponent,
    Holiday,
  } = Hr;

  await AttendancePolicy.findOrCreate({
    where: { name: "Default Office Policy" },
    defaults: {
      work_start: "09:00",
      work_end: "18:00",
      grace_minutes: 15,
      require_location: false,
      weekly_offs: [0, 6],
      is_default: true,
      status: "active",
    },
  });

  await WorkingDayConfig.findOrCreate({
    where: { name: "Mon-Fri" },
    defaults: { days: [1, 2, 3, 4, 5], hours_per_day: 8, is_default: true },
  });

  await AuthorizedLocation.findOrCreate({
    where: { name: "Head Office" },
    defaults: {
      address: "Bengaluru",
      latitude: 12.9716,
      longitude: 77.5946,
      radius_meters: 500,
      status: "active",
    },
  });

  const leaveDefs = [
    { code: "CL", name: "Casual Leave", allocation: 12 },
    { code: "SL", name: "Sick Leave", allocation: 10 },
    { code: "EL", name: "Earned Leave", allocation: 15 },
  ];

  for (const def of leaveDefs) {
    const [type] = await LeaveType.findOrCreate({
      where: { code: def.code },
      defaults: { name: def.name, paid: true, status: "active" },
    });
    await LeavePolicy.findOrCreate({
      where: { leave_type_id: type.id, is_default: true },
      defaults: {
        leave_type_id: type.id,
        annual_allocation: def.allocation,
        carry_forward: def.code === "EL",
        requires_approval: true,
        is_default: true,
      },
    });
  }

  const components = [
    { code: "HRA", name: "House Rent Allowance", type: "earning", is_percentage: true, default_value: 40 },
    { code: "SA", name: "Special Allowance", type: "earning", is_percentage: false, default_value: 5000 },
    { code: "PF", name: "Provident Fund", type: "deduction", is_percentage: true, default_value: 12 },
    { code: "PT", name: "Professional Tax", type: "deduction", is_percentage: false, default_value: 200 },
  ];

  for (const c of components) {
    await SalaryComponent.findOrCreate({
      where: { code: c.code },
      defaults: { ...c, status: "active" },
    });
  }

  const year = new Date().getFullYear();
  await Holiday.findOrCreate({
    where: { name: "Republic Day", date: `${year}-01-26` },
    defaults: { type: "public", description: "National holiday" },
  });
  await Holiday.findOrCreate({
    where: { name: "Independence Day", date: `${year}-08-15` },
    defaults: { type: "public", description: "National holiday" },
  });

  console.log("✅ HR defaults seeded");
}

async function main() {
  console.log("🔧 Production DB setup");
  console.log(`   env file : ${envFile}`);
  console.log(`   host     : ${DB_HOST}:${DB_PORT}`);
  console.log(`   database : ${DB_NAME}`);
  console.log(`   ssl      : ${DB_SSL === "true" ? "on" : "off"}`);

  await createDatabaseIfNeeded();

  // Import after DB exists so model connection targets the right schema
  const { default: db } = await import("../config/Database.js");
  const { User, syncModels, HrModels } = await import("../models/index.js");

  // Ensure every production table is registered before sync
  await import("../models/Skill.js");
  await import("../models/Loan.js");
  await import("../models/Expense.js");
  await import("../models/Transaction.js");
  await import("../models/DataPegawaiModel.js");
  await import("../models/DataJabatanModel.js");
  await import("../models/DataKehadiranModel.js");
  await import("../models/PotonganGajiModel.js");
  await import("../models/hr/index.js");

  await db.authenticate();
  console.log("✅ Connected to database");

  const SequelizeStore = SequelizeStoreFactory(session.Store);
  const store = new SequelizeStore({
    db,
    tableName: "sessions",
    checkExpirationInterval: 15 * 60 * 1000,
    expiration: 24 * 60 * 60 * 1000,
  });
  await store.sync();
  console.log("✅ sessions table ready");

  await syncModels();

  const { ensureListIndexes } = await import("./ensureListIndexes.js");
  await ensureListIndexes(db, { close: false });
  console.log("✅ List indexes ensured");

  await seedAdmin(User);
  await seedHrDefaults(HrModels);

  const [tables] = await db.query(
    `SELECT COUNT(*) AS table_count
     FROM information_schema.tables
     WHERE table_schema = :dbName`,
    { replacements: { dbName: DB_NAME } }
  );
  const tableCount = tables?.[0]?.table_count ?? tables?.[0]?.TABLE_COUNT ?? "?";

  console.log("\n—— Setup complete ——");
  console.log(`   Tables     : ${tableCount}`);
  console.log("   Admin login: admin / Admin@123");
  console.log("   Next:");
  console.log("     1. Change the admin password immediately");
  console.log("     2. Start API (PM2) and point Nginx at Frontend/dist");
  console.log("     3. GET /api/health → database: connected");
  console.log("     4. Optional: npm run db:export-schema");

  await db.close();
}

main().catch((err) => {
  console.error("❌ setupProductionDb failed:", err.message || err);
  process.exit(1);
});

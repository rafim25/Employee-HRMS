/**
 * Export states + cities from the connected DB into scripts/data/indiaLocations.json
 * so seedLocations can re-insert the full set on another environment.
 *
 * Usage:
 *   NODE_ENV=production node scripts/exportLocationsFromDb.js
 *   npm run export:locations
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envFile = process.env.NODE_ENV === "production" ? ".env.production" : ".env";
dotenv.config({ path: path.join(__dirname, "..", envFile) });

async function main() {
  const { default: db } = await import("../config/Database.js");
  const { State, City } = await import("../models/index.js");

  await db.authenticate();

  const states = await State.findAll({
    order: [["name", "ASC"]],
    include: [
      {
        model: City,
        as: "cities",
        required: false,
        attributes: ["name", "status"],
      },
    ],
  });

  const payload = states.map((state) => {
    const cities = (state.cities || [])
      .filter((c) => c.status !== "inactive")
      .map((c) => c.name)
      .sort((a, b) => a.localeCompare(b));

    // de-dupe case-insensitively
    const seen = new Set();
    const unique = [];
    for (const name of cities) {
      const key = String(name).toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      unique.push(name);
    }

    return {
      name: state.name,
      code: state.code,
      cities: unique,
    };
  });

  const outPath = path.join(__dirname, "data", "indiaLocations.json");
  fs.writeFileSync(outPath, JSON.stringify(payload, null, 2));

  const cityTotal = payload.reduce((n, s) => n + s.cities.length, 0);
  console.log(`✅ Exported ${payload.length} states / ${cityTotal} cities → ${outPath}`);
  await db.close();
}

main().catch((err) => {
  console.error("❌ exportLocationsFromDb failed:", err.message || err);
  process.exit(1);
});

/**
 * Seed Indian states + major cities (idempotent).
 *
 * Usage:
 *   NODE_ENV=production npm run seed:locations
 *   npm run seed:locations
 *
 * Reads Backend/.env.production when NODE_ENV=production, else Backend/.env.
 */
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import { INDIA_LOCATIONS } from "./data/indiaLocations.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envFile = process.env.NODE_ENV === "production" ? ".env.production" : ".env";
dotenv.config({ path: path.join(__dirname, "..", envFile) });

/**
 * @param {{ close?: boolean }} [options]
 */
export async function seedIndiaLocations(options = {}) {
  const { close = true } = options;
  const { default: db } = await import("../config/Database.js");
  const { State, City } = await import("../models/index.js");

  await db.authenticate();
  await State.sync();
  await City.sync();

  let statesCreated = 0;
  let statesExisting = 0;
  let citiesCreated = 0;
  let citiesExisting = 0;

  for (const entry of INDIA_LOCATIONS) {
    const name = String(entry.name).trim();
    const code = String(entry.code).trim().toUpperCase();
    if (!name || !code) continue;

    let state = await State.findOne({ where: { code } });
    if (!state) {
      state = await State.findOne({ where: { name } });
    }

    if (!state) {
      state = await State.create({
        uuid: uuidv4(),
        name,
        code,
        status: "active",
      });
      statesCreated += 1;
      console.log(`+ state  ${code}  ${name}`);
    } else {
      let dirty = false;
      if (state.name !== name) {
        state.name = name;
        dirty = true;
      }
      if (state.code !== code) {
        state.code = code;
        dirty = true;
      }
      if (state.status !== "active") {
        state.status = "active";
        dirty = true;
      }
      if (dirty) await state.save();
      statesExisting += 1;
    }

    for (const rawCity of entry.cities || []) {
      const cityName = String(rawCity).trim().replace(/\s+/g, " ");
      if (!cityName) continue;

      const [city, created] = await City.findOrCreate({
        where: { state_id: state.id, name: cityName },
        defaults: {
          uuid: uuidv4(),
          name: cityName,
          state_id: state.id,
          status: "active",
        },
      });

      if (created) {
        citiesCreated += 1;
      } else {
        if (city.status !== "active") {
          city.status = "active";
          await city.save();
        }
        citiesExisting += 1;
      }
    }
  }

  const stateCount = await State.count();
  const cityCount = await City.count();

  console.log("\n—— Location seed complete ——");
  console.log(`   States : ${stateCount} total (+${statesCreated} new, ${statesExisting} existing)`);
  console.log(`   Cities : ${cityCount} total (+${citiesCreated} new, ${citiesExisting} existing)`);
  console.log(`   Env    : ${envFile}`);

  if (close) await db.close();
  return { stateCount, cityCount, statesCreated, citiesCreated };
}

const isDirectRun =
  process.argv[1] &&
  (process.argv[1].endsWith("seedLocations.js") ||
    process.argv[1].includes("seedLocations"));

if (isDirectRun) {
  seedIndiaLocations({ close: true }).catch((err) => {
    console.error("❌ seedLocations failed:", err.message || err);
    process.exit(1);
  });
}

/**
 * Full India states/UTs + cities for location seeding.
 * Source data: scripts/data/indiaLocations.json (36 states, ~4242 cities).
 *
 * To refresh from a live DB (when MySQL is up):
 *   NODE_ENV=production node scripts/exportLocationsFromDb.js
 */
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const raw = readFileSync(join(__dirname, "indiaLocations.json"), "utf8");

export const INDIA_LOCATIONS = JSON.parse(raw);

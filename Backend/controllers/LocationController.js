import { Op } from "sequelize";
import { State, City } from "../models/index.js";

const normalizeName = (value = "") => String(value).trim().replace(/\s+/g, " ");

const normalizeCityName = (value = "") =>
  normalizeName(value).replace(/\.+$/g, "").trim();

const parseCityNames = (citiesInput = "") => {
  const raw =
    typeof citiesInput === "string"
      ? citiesInput.split(",")
      : Array.isArray(citiesInput)
        ? citiesInput
        : [];

  const seen = new Set();
  const cities = [];
  for (const item of raw) {
    const name = normalizeCityName(item);
    if (!name) continue;
    const key = name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    cities.push(name);
  }
  return cities;
};

/** Parse numbered bulk paste:
 * 1. Himachal Pradesh
 * City A, City B, City C.
 *
 * 2. Jammu & Kashmir
 * City X, City Y.
 */
const parseBulkLocationText = (text = "") => {
  const lines = String(text).split(/\r?\n/);
  const blocks = [];
  let current = null;

  for (const line of lines) {
    const header = line.match(/^\s*\d+\.\s+(.+?)\s*$/);
    if (header) {
      if (current) blocks.push(current);
      current = { state: normalizeName(header[1]), cityLines: [] };
      continue;
    }
    if (current && line.trim()) {
      current.cityLines.push(line.trim());
    }
  }
  if (current) blocks.push(current);

  return blocks
    .map((block) => ({
      state: block.state,
      cities: parseCityNames(block.cityLines.join(" ")),
    }))
    .filter((block) => block.state && block.cities.length > 0);
};

const generateStateCode = async (name) => {
  const letters = normalizeName(name)
    .toUpperCase()
    .replace(/[^A-Z]/g, "");
  let base = letters.slice(0, 3) || "ST";
  if (base.length < 2) base = `${base}X`.slice(0, 2);

  let code = base;
  let suffix = 1;
  while (await State.findOne({ where: { code } })) {
    code = `${base}${suffix}`;
    suffix += 1;
  }
  return code;
};

const findStateByCodeOrId = async (stateCode) => {
  const asNumber = Number(stateCode);
  if (Number.isInteger(asNumber) && asNumber > 0) {
    const byId = await State.findByPk(asNumber);
    if (byId) return byId;
  }
  return State.findOne({
    where: {
      [Op.or]: [
        { code: String(stateCode) },
        { name: String(stateCode) },
      ],
    },
  });
};

const formatState = (state) => ({
  id: state.id,
  uuid: state.uuid,
  name: state.name,
  iso2: state.code,
  code: state.code,
  status: state.status,
});

const formatCity = (city) => ({
  id: city.id,
  uuid: city.uuid,
  name: city.name,
  state_id: city.state_id,
  status: city.status,
});

export const getIndianStates = async (req, res) => {
  try {
    const states = await State.findAll({
      where: { status: "active" },
      order: [["name", "ASC"]],
    });
    res.json(states.map(formatState));
  } catch (error) {
    console.error("Error fetching states:", error);
    res.status(500).json({ message: "Failed to fetch states" });
  }
};

export const getDistrictsByState = async (req, res) => {
  try {
    const { stateCode } = req.params;
    const state = await findStateByCodeOrId(stateCode);
    if (!state) {
      return res.status(404).json({ message: "State not found" });
    }

    const cities = await City.findAll({
      where: { state_id: state.id, status: "active" },
      order: [["name", "ASC"]],
    });
    // Kept as "districts" path for existing frontend compatibility.
    res.json(cities.map(formatCity));
  } catch (error) {
    console.error("Error fetching districts:", error);
    res.status(500).json({ message: "Failed to fetch districts" });
  }
};

export const getCitiesByDistrict = async (req, res) => {
  try {
    const { stateCode, districtCode } = req.params;
    const state = await findStateByCodeOrId(stateCode);
    if (!state) {
      return res.status(404).json({ message: "State not found" });
    }

    const cityName = decodeURIComponent(districtCode);
    const cities = await City.findAll({
      where: {
        state_id: state.id,
        status: "active",
        name: { [Op.like]: cityName },
      },
      order: [["name", "ASC"]],
    });
    res.json(cities.map(formatCity));
  } catch (error) {
    console.error("Error fetching cities:", error);
    res.status(500).json({ message: "Failed to fetch cities" });
  }
};

export const listManagedLocations = async (req, res) => {
  try {
    const states = await State.findAll({
      include: [
        {
          model: City,
          as: "cities",
          attributes: ["id", "uuid", "name", "status"],
          separate: true,
          order: [["name", "ASC"]],
        },
      ],
      order: [["name", "ASC"]],
    });

    res.json(
      states.map((state) => ({
        ...formatState(state),
        cities: (state.cities || []).map(formatCity),
        cityNames: (state.cities || []).map((city) => city.name).join(", "),
      }))
    );
  } catch (error) {
    console.error("Error listing locations:", error);
    res.status(500).json({ message: "Failed to list locations", error: error.message });
  }
};

const createStateWithCities = async (stateName, cityNames) => {
  const code = await generateStateCode(stateName);
  const state = await State.create({
    name: stateName,
    code,
    status: "active",
  });

  await City.bulkCreate(
    cityNames.map((name) => ({
      name,
      state_id: state.id,
      status: "active",
    }))
  );

  return state;
};

export const createManagedLocation = async (req, res) => {
  try {
    // Bulk paste in a single textarea (preferred create path)
    if (req.body.text || req.body.bulk) {
      return bulkCreateManagedLocations(req, res);
    }

    const stateName = normalizeName(req.body.state || req.body.name);
    if (!stateName) {
      return res.status(400).json({ message: "State name is required" });
    }

    const cityNames = parseCityNames(req.body.cities);
    if (!cityNames.length) {
      return res.status(400).json({ message: "At least one city is required" });
    }

    const existing = await State.findOne({
      where: { name: { [Op.like]: stateName } },
    });
    if (existing) {
      return res.status(409).json({
        message: `State "${stateName}" already exists. Edit it instead of creating a duplicate.`,
      });
    }

    const state = await createStateWithCities(stateName, cityNames);
    const cities = await City.findAll({
      where: { state_id: state.id },
      order: [["name", "ASC"]],
    });

    res.status(201).json({
      message: "State and cities saved successfully",
      data: {
        ...formatState(state),
        cities: cities.map(formatCity),
      },
    });
  } catch (error) {
    console.error("Error creating location:", error);
    res.status(500).json({ message: "Failed to save location", error: error.message });
  }
};

export const bulkCreateManagedLocations = async (req, res) => {
  try {
    const text = req.body.text || req.body.bulk || "";
    const parsed = parseBulkLocationText(text);
    if (!parsed.length) {
      return res.status(400).json({
        message:
          "No valid states found. Use numbered blocks like:\n1. State Name\nCity A, City B, City C.",
      });
    }

    const created = [];
    const skipped = [];

    for (const item of parsed) {
      const existing = await State.findOne({
        where: { name: { [Op.like]: item.state } },
      });
      if (existing) {
        skipped.push(item.state);
        continue;
      }

      const state = await createStateWithCities(item.state, item.cities);
      created.push({
        ...formatState(state),
        cityCount: item.cities.length,
      });
    }

    res.status(201).json({
      message: `Added ${created.length} state(s), skipped ${skipped.length} existing`,
      created,
      skipped,
    });
  } catch (error) {
    console.error("Error bulk creating locations:", error);
    res.status(500).json({ message: "Failed to save locations", error: error.message });
  }
};

export const updateManagedLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const state = await State.findByPk(id);
    if (!state) {
      return res.status(404).json({ message: "State not found" });
    }

    const stateName = normalizeName(req.body.state || req.body.name || state.name);
    if (!stateName) {
      return res.status(400).json({ message: "State name is required" });
    }

    const cityNames = parseCityNames(req.body.cities);
    if (!cityNames.length) {
      return res.status(400).json({ message: "At least one city is required" });
    }

    const duplicate = await State.findOne({
      where: {
        id: { [Op.ne]: state.id },
        name: { [Op.like]: stateName },
      },
    });
    if (duplicate) {
      return res.status(409).json({ message: `Another state named "${stateName}" already exists.` });
    }

    await state.update({ name: stateName });

    const existingCities = await City.findAll({ where: { state_id: state.id } });
    const existingByKey = new Map(
      existingCities.map((city) => [city.name.toLowerCase(), city])
    );
    const incomingKeys = new Set(cityNames.map((name) => name.toLowerCase()));

    for (const name of cityNames) {
      const key = name.toLowerCase();
      if (!existingByKey.has(key)) {
        await City.create({ name, state_id: state.id, status: "active" });
      } else {
        const city = existingByKey.get(key);
        if (city.status !== "active" || city.name !== name) {
          await city.update({ name, status: "active" });
        }
      }
    }

    for (const city of existingCities) {
      if (!incomingKeys.has(city.name.toLowerCase())) {
        await city.destroy();
      }
    }

    const cities = await City.findAll({
      where: { state_id: state.id },
      order: [["name", "ASC"]],
    });

    res.json({
      message: "State and cities updated successfully",
      data: {
        ...formatState(state),
        cities: cities.map(formatCity),
      },
    });
  } catch (error) {
    console.error("Error updating location:", error);
    res.status(500).json({ message: "Failed to update location", error: error.message });
  }
};

export const deleteManagedLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const state = await State.findByPk(id);
    if (!state) {
      return res.status(404).json({ message: "State not found" });
    }

    await City.destroy({ where: { state_id: state.id } });
    await state.destroy();

    res.json({ message: "State and its cities deleted successfully" });
  } catch (error) {
    console.error("Error deleting location:", error);
    res.status(500).json({ message: "Failed to delete location", error: error.message });
  }
};

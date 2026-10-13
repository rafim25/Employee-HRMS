import argon2 from "argon2";
import { v4 as uuidv4 } from "uuid";
import User from "../models/User.js";
import db from "../config/Database.js";

const seedAdmin = async () => {
  await db.authenticate();
  await User.sync();

  const username = "admin";
  const password = "Admin@123";
  const existing = await User.findOne({ where: { username } });

  if (existing) {
    existing.password = await argon2.hash(password);
    existing.role = "admin";
    existing.status = "active";
    await existing.save();
    console.log("Updated existing admin user password");
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
    console.log("Created admin user");
  }

  await db.close();
};

seedAdmin().catch((error) => {
  console.error("Failed to seed admin:", error);
  process.exit(1);
});

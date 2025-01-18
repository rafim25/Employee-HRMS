import { Sequelize } from "sequelize";

const db = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER_NAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_URL || "localhost",
    dialect: "mysql",
  }
);

export default db;

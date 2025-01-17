import { Sequelize } from "sequelize";

const db = new Sequelize("db_penggajian3", "root", "Pas5word@1$3", {
  host: "localhost",
  dialect: "mysql",
});

export default db;

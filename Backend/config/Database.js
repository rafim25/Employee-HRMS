import { Sequelize } from 'sequelize';
import mysql2 from 'mysql2';

const db = new Sequelize('db_penggajian3', 'root', '', {
    host: "localhost",
    dialect: "mysql",
    dialectModule: mysql2,
});

export default db;
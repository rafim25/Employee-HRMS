import { Sequelize } from 'sequelize';

const db = new Sequelize('db_penggajian3', 'root', '', {
    host: "localhost",
    dialect: "mysql",
    dialectModule: require('mysql2'),
});

export default db;
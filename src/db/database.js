const config = require('../config/config.json');
const mysql = require('mysql2');
const Sequelize = require("sequelize");

// Create connection to MySQL with Sequelize
const db = new Sequelize(config.database, config.user, config.password, {
    host: config.host,
    dialect: config.dialect,
    operatorsAliases: config.operatorsAliases,

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});
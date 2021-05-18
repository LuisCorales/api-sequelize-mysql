// Get sequelize and configuration
const config = require('../../config/config.json');
const Sequelize = require("sequelize");

const { username, password, database, host, dialect } = config.development;

// Create connection to MySQL with Sequelize
const db = new Sequelize(database, username, password, {
    host: host,
    dialect: dialect,

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

// Test connection with DB
const testConnection = async () => {
    try {
        await db.authenticate();
        console.log('Database connected!');
    } catch(e) {
        console.error('Unable to connect to the database:', e);
    }
}

module.exports = testConnection;
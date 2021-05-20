const db = require('../database');
const Sequelize = require('sequelize');

// Define hospital model
const Hospital = db.define('hospital', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    name: Sequelize.STRING(60),
});

module.exports = Hospital;
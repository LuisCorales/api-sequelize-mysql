const db = require('../database');
const Sequelize = require('sequelize');

// Define appointment model
const Appointment = db.define('appointment', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    startTime: {
        type: Sequelize.DATE,
        allowNull: false
    },
    endTime: { 
        type: Sequelize.DATE,
        allowNull: false,
    }
});

module.exports = Appointment;
const db = require('../database');
const Sequelize = require('sequelize');

// Define appointment model
module.exports = db.define('appointment', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    patientId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'patients',
            key: 'id',
        },
        onUpdate: 'NO ACTION',
        onDelete: 'NO ACTION'
    },
    doctorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'doctors',
            key: 'id'
        },
        onUpdate: 'NO ACTION',
        onDelete: 'NO ACTION'
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
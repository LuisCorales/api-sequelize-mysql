const db = require('../database');
const Sequelize = require('sequelize');

// Define doctor model
const Doctor = db.define('doctor', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    firstName: {
        type: Sequelize.STRING(60),
        allowNull: false
    },
    surname: {
        type: Sequelize.STRING(60),
        allowNull: false
    },
    speciality: {
        type: Sequelize.STRING(20),
        allowNull: false
    },
    hospitalId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'hospitals',
            key: 'id'
        },
        onUpdate: 'NO ACTION',
        onDelete: 'NO ACTION'
    },
});

module.exports = Doctor;
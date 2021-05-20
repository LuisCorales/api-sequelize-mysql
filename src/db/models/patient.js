const db = require('../database');
const Sequelize = require('sequelize');

/** Define patient model */ 
const Patient = db.define('patient', {
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
    idDocument: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true
    },
    pathology: Sequelize.STRING(100)
});

module.exports = Patient;
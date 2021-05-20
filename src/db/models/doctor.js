const db = require('../database');
const Sequelize = require('sequelize');

/** Define doctor model */ 
const Doctor = db.define('doctor', {
    firstName: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            is: {
                args: /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\'\s]*)$/g,
                msg: "surname can only contain letters and '."
            },
            len: {
                args: [3, 60],
                msg: "firstName can only have from 3 to 60 letters."
            },
            notNull: {
                msg: "firstName cannot be null."
            }
        }
    },
    surname: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            is: {
                args: /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\'\s]*)$/g,
                msg: "surname can only contain letters and '."
            },
            len: {
                args: [3, 60],
                msg: "surname can only have from 3 to 60 letters."
            },
            notNull: {
                msg: "surname cannot be null."
            }
        }
    },
    speciality: {
        type: Sequelize.STRING(100),
        allowNull: false
    },
}, {
    timestamps: false
});

module.exports = Doctor;
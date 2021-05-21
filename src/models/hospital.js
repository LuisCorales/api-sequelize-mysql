const db = require('../db/database');
const Sequelize = require('sequelize');

/** Define hospital model */ 
const Hospital = db.define('hospital', {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: {
                args: [3, 60],
                msg: "surname can only have from 3 to 60 letters."
            },
            notNull: {
                msg: "surname cannot be null."
            }
        }
    },
}, {
    timestamps: false
});

module.exports = Hospital;
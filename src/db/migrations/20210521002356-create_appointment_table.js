'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('appointments', {
      startTime: {
        type: Sequelize.DATE,
        allowNull: false,
        validate: {
          isDate: {
            args: true,
            msg: "startTime can only be a date."
          },
          isAfter: {
            args: new Date(new Date().setDate(new Date().getDate() - 1)).toDateString(),
            msg: "startTime cannot be start before today."
          }
        }
      },
      endTime: { 
        type: Sequelize.DATE,
        allowNull: false,
        validate: {
          isDate: {
            args: true,
            msg: "endTime can only be a date."
          }, 
          isAfter: {
            args: new Date(new Date().setDate(new Date().getDate() - 1)).toDateString(),
            msg: "endTime cannot end before today."
          }
        }
      },
    }, {
      timestamps: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('appointments');
  }
};

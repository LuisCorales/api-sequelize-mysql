'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('appointments', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      start_time: {
        type: Sequelize.DATE,
        allowNull: false,
        validate: {
          isDate: {
            args: true,
            msg: "start_time can only be a date."
          },
          isAfter: {
            args: new Date(new Date().setDate(new Date().getDate() - 1)).toDateString(),
            msg: "start_time cannot be start before today."
          }
        }
      },
      end_time: { 
        type: Sequelize.DATE,
        allowNull: false,
        validate: {
          isDate: {
            args: true,
            msg: "end_time can only be a date."
          }, 
          isAfter: {
            args: new Date(new Date().setDate(new Date().getDate() - 1)).toDateString(),
            msg: "end_time cannot end before today."
          }
        }
      },
      doctor_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "doctors",
          key: "id"
        },
      },
      patient_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "patients",
          key: "id"
        },
      }
    }, {
      timestamps: false,
      paranoid: true,
      underscored: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('appointments');
  }
};

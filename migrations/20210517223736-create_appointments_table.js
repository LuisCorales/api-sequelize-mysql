'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable("appointments", {
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
    })
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable("appointments");
  }
};

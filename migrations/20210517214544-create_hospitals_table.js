'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable("hospitals", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      name: Sequelize.STRING(60),
    })
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable("hospitals");
  }
};

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable("patients", {
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
    })
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable("patients");
  }
};

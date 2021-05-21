'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('hospitals', {
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [3, 60],
            msg: "name can only have from 3 to 60 letters."
          },
          notNull: {
            msg: "name cannot be null."
          }
        }
      },
    }, {
      timestamps: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('hospitals');
  }
};

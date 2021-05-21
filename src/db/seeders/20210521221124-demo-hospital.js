'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('hospitals', [{
      name: 'HospitalA',
    }, {
      name: 'HospitalB',
    }, {
      name: 'HospitalC'
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('hospitals', null, {});
  }
};

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('doctors', [{
      firstName: 'DoctorA',
      surname: 'DoctorA',
      speciality: 'general',
      hospitalId: '1'
    }, {
      firstName: 'DoctorB',
      surname: 'DoctorB',
      speciality: 'hematology',
      hospitalId: '2'
    }, {
      firstName: 'DoctorC',
      surname: 'DoctorC',
      speciality: 'oncology',
      hospitalId: '3'
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('doctors', null, {});
  }
};

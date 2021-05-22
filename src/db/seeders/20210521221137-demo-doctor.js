'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('doctors', [{
      firstname: 'DoctorA',
      surname: 'DoctorA',
      speciality: 'general',
      hospital_id: '1'
    }, {
      firstname: 'DoctorB',
      surname: 'DoctorB',
      speciality: 'hematology',
      hospital_id: '2'
    }, {
      firstname: 'DoctorC',
      surname: 'DoctorC',
      speciality: 'oncology',
      hospital_id: '3'
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('doctors', null, {});
  }
};

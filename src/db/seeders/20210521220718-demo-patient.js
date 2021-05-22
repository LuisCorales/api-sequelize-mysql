'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('patients', [{
      firstname: 'PatientA',
      surname: 'PatientA',
      id_document: '111',
      pathology: 'flu'
    }, {
      firstname: 'PatientB',
      surname: 'PatientB',
      id_document: '222',
      pathology: 'cancer'
    }, {
      firstname: 'PatientC',
      surname: 'PatientC',
      id_document: '333',
      pathology: 'anemia'
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('patients', null, {});
  }
};

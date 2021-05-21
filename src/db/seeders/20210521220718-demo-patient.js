'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('patients', [{
      firstName: 'PatientA',
      surname: 'PatientA',
      idDocument: '111',
      pathology: 'flu'
    }, {
      firstName: 'PatientB',
      surname: 'PatientB',
      idDocument: '222',
      pathology: 'cancer'
    }, {
      firstName: 'PatientC',
      surname: 'PatientC',
      idDocument: '333',
      pathology: 'anemia'
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('patients', null, {});
  }
};

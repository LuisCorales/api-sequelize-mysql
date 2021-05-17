// Create appointment table
const sql = 'CREATE TABLE IF NOT EXISTS medicaldb.appointment ( ' +
    'id INT NOT NULL AUTO_INCREMENT, ' +
    'doctorId INT NOT NULL, ' +
    'patientId INT NOT NULL, ' +
    'startTime DATETIME NOT NULL, ' +
    'endTime DATETIME NOT NULL, ' +
    'PRIMARY KEY (id), ' +
    'INDEX doctorId_idx (doctorId ASC) VISIBLE, ' +
    'INDEX patientId_idx (patientId ASC) VISIBLE, ' +
    'CONSTRAINT doctorId ' +
      'FOREIGN KEY (doctorId) ' +
      'REFERENCES medicaldb.doctor (id) ' +
      'ON DELETE NO ACTION ' +
      'ON UPDATE NO ACTION,' +
    'CONSTRAINT patientId ' +
      'FOREIGN KEY (patientId) ' +
      'REFERENCES medicaldb.patient (id) ' +
      'ON DELETE NO ACTION ' +
      'ON UPDATE NO ACTION)';

module.exports = sql;
// Create doctor table
const sql = 'CREATE TABLE IF NOT EXISTS medicaldb.doctor ( ' +
    'id INT NOT NULL AUTO_INCREMENT, ' +
    'firstName VARCHAR(60) NOT NULL, ' +
    'surname VARCHAR(60) NOT NULL, ' +
    'speciality VARCHAR(60) NOT NULL, ' +
    'hospitalId INT NOT NULL, ' +
    'PRIMARY KEY (id), ' +
    'INDEX hospitalId_idx (hospitalId ASC) VISIBLE, ' +
    'CONSTRAINT hospitalId ' +
      'FOREIGN KEY (hospitalId) ' +
      'REFERENCES medicaldb.hospital (id) ' +
      'ON DELETE NO ACTION ' +
      'ON UPDATE NO ACTION)';

module.exports = sql;
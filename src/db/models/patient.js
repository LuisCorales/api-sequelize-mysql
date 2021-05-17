// Create patient table
const sql = 'CREATE TABLE IF NOT EXISTS medicaldb.patient ( ' + 
    'id int AUTO_INCREMENT, ' +
    'firstName VARCHAR(60) NOT NULL, ' + 
    'surname VARCHAR(60) NOT NULL, ' + 
    'pathology VARCHAR(100), ' + 
    'PRIMARY KEY(id) )';

module.exports = sql;
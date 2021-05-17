// Create hospital table
const sql = 'CREATE TABLE IF NOT EXISTS medicaldb.hospital ( ' + 
    'id int AUTO_INCREMENT, ' +
    'name VARCHAR(60) NOT NULL, ' + 
    'PRIMARY KEY(id) )';

module.exports = sql;
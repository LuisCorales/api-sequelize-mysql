const database = require("../db/database");
const db = database.db;

// If there is an error, send to response
const sendError = (res, e) => {
    return res.status(404).json({
        message: 'There was a problem...',
        error: e.message
    });
};

// All the functions will be executed when a patients route is called

// To GET patients route
exports.getAll = (req, res) => {
    try {
        let sql = 'SELECT * FROM medicaldb.patient';

        db.query(sql, (err, result) => {
            if(err) {
                throw err;
            }

            if(result.length == 0) {
                return res.status(200).json({
                    message: 'GET request to /patients/',
                    warning: 'There is no patients yet'
                });
            }
            
            return res.status(200).json({
                message: 'GET request to /patients',
                patients: result
            });
        });
    } catch(e) {
        sendError(res, e);
    }
};

// To POST patients route
exports.post = (req, res) => {
    try {
        if(req.body.firstName == null || req.body.surname == null)
        {
            throw new Error("firstName or surname cannot be NULL");
        }

        let patientData = {
            firstName: req.body.firstName,
            surname: req.body.surname,
            pathology: req.body.pathology
        }
        let sql = 'INSERT INTO medicaldb.patient SET ?';

        db.query(sql, patientData, (err) => {
            if(err) {
                throw err;
            } 
            
            return res.status(200).json({
                message: 'POST request to /patients',
                createdPatient: patientData
            });
        });  
    } catch(e) {
        sendError(res, e);
    }
}; 

// To GET by id patients route
exports.getOne = (req, res) => {
    try {
        if(isNaN(req.params.patientId))
        {
            throw new Error("The id must be a number")
        }
        
        let id = req.params.patientId;

        let sql = 'SELECT * FROM medicaldb.patient WHERE id = ' + id;

        db.query(sql, (err, result) => {
            if(err) {
                throw err;
            }

            if(result.length == 0) {
                return res.status(200).json({
                    message: 'GET request to /patients/' + id,
                    warning: 'There is no patient with id: ' + id
                });
            }
            
            return res.status(200).json({
                message: 'GET request to /patients/' + id,
                patient: result
            });
        });
    } catch(e) {
        sendError(res, e);
    }
};

// To PUT patients route
exports.put = (req, res) => {
    try {
        if(isNaN(req.params.patientId))
        {
            throw new Error("The id must be a number")
        }

        if(req.body.firstName == null || req.body.surname == null)
        {
            throw new Error("firstName or surname cannot be NULL");
        }

        let id = req.params.patientId;
        let patientData = {
            firstName: req.body.firstName,
            surname: req.body.surname,
            pathology: req.body.pathology
        }

        let sql = 'UPDATE medicaldb.patient SET ? WHERE id = ' + id;
        db.query(sql, patientData, (err, result) => {
            if(err) {
                throw err;
            } 

            if(result.changedRows == 0)
            {
                return res.status(200).json({
                    message: 'PUT request to /patients/' + id,
                    warning: 'There is no patient with id: ' + id
                });
            }
            
            return res.status(200).json({
                message: 'PUT request to /patients/' + id,
                updatedPatient: patientData
            });
        });  
    } catch(e) {
        sendError(res, e);
    }
};

// To DELETE patients route
exports.delete = (req, res) => {
    try {
        if(isNaN(req.params.patientId))
        {
            throw new Error("The id must be a number")
        }

        let id = req.params.patientId;

        let sql = 'DELETE FROM medicaldb.patient WHERE id = ' + id;

        db.query(sql, (err, result) => {
            if(err) {
                throw err;
            }

            if(result.changedRows == 0)
            {
                return res.status(200).json({
                    message: 'DELETE request to /patients/' + id,
                    warning: 'There is no patient with id: ' + id
                });
            }
            
            return res.status(200).json({
                message: 'DELETE request to /patients/' + id,
                deletedPatient: result
            });
        }); 
    } catch(e) {
        sendError(res, e);
    }
};
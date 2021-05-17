const database = require("../db/database");
const db = database.db;

// If there is an error, send to response
const sendError = (res, e) => {
    return res.status(404).json({
        message: 'There was a problem...',
        error: e.message
    });
};

// All the functions will be executed when a doctors route is called

// To GET doctors route
exports.getAll = (req, res) => {
    try {
        let sql = 'SELECT doctor.id, doctor.firstName, doctor.surname, doctor.speciality, ' + 
        'hospital.name AS hospitalName ' + 
        'FROM medicaldb.doctor ' +
        'INNER JOIN medicaldb.hospital ' +
        'ON doctor.hospitalId = hospital.id';

        db.query(sql, (err, result) => {
            if(err) {
                throw err;
            }

            if(result.length == 0) {
                return res.status(200).json({
                    message: 'GET request to /doctors/',
                    warning: 'There are no doctors yet'
                });
            }

            return res.status(200).json({
                message: 'GET request to /doctors',
                doctor: result
            });
        });
    } catch(e) {
        sendError(res, e);
    }
};

// To POST doctors route
exports.post = (req, res) => {
    try {
        if(req.body.firstName == null || req.body.surname == null || req.body.speciality == null || req.body.hospitalId == null)
        {
            throw new Error("None value can be NULL");
        }

        let doctorData = {
            firstName: req.body.firstName,
            surname: req.body.surname,
            speciality: req.body.speciality,
            hospitalId: req.body.hospitalId
        }

        let sql = 'INSERT INTO medicaldb.doctor SET ?';
    
        db.query(sql, doctorData, (err) => {
            if(err) {
                throw err;
            } 
            
            return res.status(200).json({
                message: 'POST request to /doctors',
                createdDoctor: doctorData
            });
        });    
    } catch(e) {
        sendError(res, e);
    }
}; 

// To GET by id doctors route
exports.getOne = (req, res) => {
    try {
        if(isNaN(req.params.doctorId))
        {
            throw new Error("The id must be a number")
        }

        let id = req.params.doctorId;

        let sql = 'SELECT doctor.id, doctor.firstName, doctor.surname, doctor.speciality, ' + 
        'hospital.name AS hospitalName ' + 
        'FROM medicaldb.doctor ' +
        'INNER JOIN medicaldb.hospital ' +
        'ON doctor.hospitalId = hospital.id ' +
        'WHERE doctor.id = ' + id;

        db.query(sql, (err, result) => {
            if(err) {
                throw err;
            }

            if(result.length == 0) {
                return res.status(200).json({
                    message: 'GET request to /doctors/' + id,
                    warning: 'There is no doctor with id: ' + id
                });
            }
            
            return res.status(200).json({
                message: 'GET request to /doctors/' + id,
                doctor: result
            });
        });
    } catch(e) {
        sendError(res, e);
    }
};

// To PUT doctors route
exports.put = (req, res) => {
    try {
        if(isNaN(req.params.doctorId))
        {
            throw new Error("The id must be a number")
        }

        if(req.body.firstName == null || req.body.surname == null || req.body.speciality == null || req.body.hospitalId == null)
        {
            throw new Error("None value can be NULL");
        }

        let id = req.params.doctorId;
        let doctorData = {
            firstName: req.body.firstName,
            surname: req.body.surname,
            speciality: req.body.speciality,
            hospitalId: req.body.hospitalId
        }

        let sql = 'UPDATE medicaldb.doctor SET ? WHERE id = ' + id;

        db.query(sql, doctorData, (err, result) => {
            if(err) {
                throw err;
            }

            if(result.changedRows == 0)
            {
                return res.status(200).json({
                    message: 'PUT request to /doctors/' + id,
                    warning: 'There is no doctor with id: ' + id
                });
            }

            return res.status(200).json({
                message: 'PUT request to /doctors/' + id,
                updatedDoctor: doctorData
            });
        });  
    } catch(e) {
        sendError(res, e);
    }
};

// To DELETE doctors route
exports.delete = (req, res) => {
    try {
        if(isNaN(req.params.doctorId))
        {
            throw new Error("The id must be a number")
        }

        let id = req.params.doctorId;

        let sql = 'DELETE FROM medicaldb.doctor WHERE id = ' + id;

        db.query(sql, (err, result) => {
            if(err) {
                throw err;
            }

            if(result.changedRows == 0)
            {
                return res.status(200).json({
                    message: 'DELETE request to /doctors/' + id,
                    warning: 'There is no doctor with id: ' + id
                });
            }
            
            return res.status(200).json({
                message: 'DELETE request to /doctors/' + id,
                deletedDoctor: 'Deleted doctor with id: ' + id
            });
        }); 
    } catch(e) {
        sendError(res, e);
    }
};
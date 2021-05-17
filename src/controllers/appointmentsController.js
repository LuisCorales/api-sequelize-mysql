const Moment = require('moment');
const MomentRange = require('moment-range');

const moment = MomentRange.extendMoment(Moment);

const database = require("../db/database");
const db = database.db;

// If there is an error, send to response
const sendError = (res, e) => {
    return res.status(404).json({
        message: 'There was a problem...',
        error: e.message
    });
};

// Asign doctor by speciality
const asingDoctor = (pathology) => {
    var speciality;
    var str = pathology.toLowerCase();

    switch (str) {
        case "cancer":
            speciality = "oncology";
            break;

        case "leukemia": 
        case "anemia":
        case "hemophilia":
            speciality = "hematology";
            break;
        
        case "hypertension": 
        case "heart attack":
        speciality = "cardiology";
            break;
    
        default:
            speciality = "general";
            break;
    }

    return speciality;
};

// Check if the duration of the appointment is correct
const checkDuration = (startTime, endTime) => {
    let difference = moment.utc(moment(endTime,"YYYY-MM-dd HH:mm:ss").diff(moment(startTime,"YYYY-MM-dd HH:mm:ss"))).format("HH:mm:ss");
    
    let format = "HH:mm:ss",
    differ = moment(difference, format),
    fifteenMin = moment("00:14:00", format), 
    oneHour = moment("01:01:00", format);

    if(differ.isBetween(fifteenMin,oneHour)) {
        // Duration is correct
        var durationMessage = "Duration is less or equal to 1 hour, more or equal to 15 minutes!";
        return [true, durationMessage];
    } else {
        // Duration is incorrect
        var durationMessage = "Duration must be between 15 minutes and 1 hour...";
        return [false, durationMessage];
    }
};

// Check if date overlaps another date from the same doctor
const checkIfOverlap = (startTimeNew, endTimeNew, otherDates) => {
    if(otherDates.length == 0) {   
        var overlapMessage = "There are no appointments yet!";
        return [false, overlapMessage];
    }

    let startTime = moment.utc(moment(startTimeNew).format());
    let endTime = moment.utc(moment(endTimeNew).format());

    // For each appointment with the same doctor, check dates
    for (let i = 0; i < otherDates.length; i++) {
        let dateStart = moment.utc(moment(otherDates[i].startTime).format());
        let dateEnd = moment.utc(moment(otherDates[i].endTime).format());

        var range1 = moment().range(dateStart, dateEnd);
        var range2 = moment().range(startTime, endTime);

        if(range1.contains(startTime) && range1.contains(endTime) || (range2.contains(dateStart) || range2.contains(dateEnd))) {
            // Overlap
            var overlapMessage = "There are dates overlapping...";
            return [true, overlapMessage];
        }
    }

    var overlapMessage = "There are no overlapping dates!";
    return [false, overlapMessage];
};

// All the functions will be executed when a appointments route is called

// To GET appointments route
exports.getAll = (req, res) => {
    try {
        let sql = 'SELECT appointment.id, appointment.startTime, appointment.endTime, ' +
        'CONCAT(patient.firstName, " ", patient.surname) AS patientName, patient.pathology, ' +
        'CONCAT(doctor.firstName, " ", doctor.surname) AS doctorName, doctor.speciality, hospital.name AS hospitalName ' +
        'FROM medicaldb.appointment ' + 
        'INNER JOIN medicaldb.patient ' + 
        'ON appointment.patientId = patient.id ' +
        'INNER JOIN medicaldb.doctor ' +
        'ON appointment.doctorId = doctor.id ' +
        'INNER JOIN medicaldb.hospital ' +
        'ON doctor.hospitalId = hospital.id';

        db.query(sql, (err, result) => {
            if(err) {
                throw err;
            }

            if(result.length == 0) {
                return res.status(200).json({
                    message: 'GET request to /appointments/',
                    warning: 'There are no appointments yet'
                });
            }

            return res.status(200).json({
                message: 'GET request to /appointments',
                appointments: result
            });
        });
    } catch(e) {
        sendError(res, e);
    }
};

// To POST appointments route
exports.post = (req, res) => {
    try {
        if(req.body.patientId == null || req.body.startTime == null || req.body.endTime == null)
        {
            throw new Error("None value can be NULL");
        }

        let appointmentData = {
            patientId: req.body.patientId,
            startTime: req.body.startTime,
            endTime: req.body.endTime
        }
    
        let sql = "SELECT patient.pathology " +
        "FROM medicaldb.patient " + 
        "WHERE patient.id = " + appointmentData.patientId;

        var checkDurationValues = checkDuration(appointmentData.startTime, appointmentData.endTime);

        if(checkDurationValues[0] == false){
            // If duration is incorrect
            throw error = new Error(checkDurationValues[1]);
        }

        // Get the patient pathology
        db.query(sql, (err, result) => {
            if(err) {
                throw err;
            }

            // Get the correct speciality
            speciality = asingDoctor(result[0].pathology);

            sql = "SELECT doctor.id " +
            "FROM medicaldb.doctor " + 
            "WHERE doctor.speciality = '" + speciality + "'";

            // Get the correct doctor according to the speciality
            db.query(sql, (err, result) => {
                if(err) {
                    throw err;
                }

                if(result[0] == null) {
                    throw new Error("There is no doctor with the correct speciality")
                }

                sql = "SELECT appointment.startTime, appointment.endTime " + 
                "FROM medicaldb.appointment " + 
                "WHERE appointment.doctorId = " + result[0].id;

                db.query(sql, (err, dateResult) => {
                    if(err) {
                        throw err;
                    }

                    let overlapping = checkIfOverlap(appointmentData.startTime, appointmentData.endTime, dateResult);

                    if(overlapping[0] == false) {
                        // If it doesn't overlap
                        let data = {
                            patientId: appointmentData.patientId,
                            doctorId: result[0].id,
                            startTime: appointmentData.startTime,
                            endTime: appointmentData.endTime
                        }

                        sql = 'INSERT INTO medicaldb.appointment SET ?';

                        // Insert the data
                        db.query(sql, data, (err) => {
                            if(err) {
                                throw err;
                            }

                            return res.status(200).json({
                                message: 'POST request to /appointments',
                                createdAppointment: data
                            });
                        });
                    } else {                         
                        // If it overlaps
                        return res.status(401).json({
                            message: 'The date you input is overlapping with another...',
                            yourDate: appointmentData.startTime + " till " + appointmentData.endTime,
                            doctorDates: dateResult
                        });
                    }
                });
            });
        });
    } catch(e) {
        sendError(res, e);
    }
};

// To GET all appointments of a doctor by id
exports.getOneDoctorAppointments = (req, res) => {
    try {
        if(isNaN(req.params.doctorId))
        {
            throw new Error("The id must be a number")
        }

        let id = req.params.doctorId;

        let sql = 'SELECT appointment.id, appointment.startTime, appointment.endTime, ' +
        'CONCAT(patient.firstName, " ", patient.surname) AS patientName, patient.pathology, ' +
        'CONCAT(doctor.firstName, " ", doctor.surname) AS doctorName, doctor.speciality, hospital.name AS hospitalName ' +
        'FROM medicaldb.appointment ' + 
        'INNER JOIN medicaldb.patient ' + 
        'ON appointment.patientId = patient.id ' +
        'INNER JOIN medicaldb.doctor ' +
        'ON appointment.doctorId = doctor.id ' +
        'INNER JOIN medicaldb.hospital ' +
        'ON doctor.hospitalId = hospital.id ' +
        'WHERE appointment.doctorId = ' + id;

        db.query(sql, (err, result) => {
            if(err) {
                throw err;
            }

            return res.status(200).json({
                message: 'GET request to /appointments/' + id,
                appointment: result
            });
        });
    } catch(e) {
        sendError(res, e);
    }
};

// To PUT appointments route
exports.put = (req, res) => {
    try {
        if(isNaN(req.params.appointmentId))
        {
            throw new Error("The id must be a number")
        }

        if(req.body.patientId == null || req.body.startTime == null || req.body.endTime == null)
        {
            throw new Error("None value can be NULL");
        }

        let id = req.params.appointmentId;
        let appointmentData = {
            patientId: req.body.patientId,
            startTime: req.body.startTime,
            endTime: req.body.endTime
        }

        checkDurationValues = checkDuration(appointmentData.startTime, appointmentData.endTime);

        if(checkDurationValues[0] == false){
            // If duration is incorrect
            throw error = new Error(checkDurationValues[1]);
        }

        let sql = "SELECT patient.pathology " +
        "FROM medicaldb.patient " + 
        "WHERE patient.id = " + appointmentData.patientId;

        // Get the patient pathology
        db.query(sql, (err, result) => {
            if(err) {
                throw err;
            }

            // Get the correct speciality
            speciality = asingDoctor(result[0].pathology);

            sql = "SELECT doctor.id " +
            "FROM medicaldb.doctor " + 
            "WHERE doctor.speciality = '" + speciality + "'";

            // Get the correct doctor according to the speciality
            db.query(sql, (err, result) => {
                if(err) {
                    throw err;
                }

                sql = "SELECT appointment.startTime, appointment.endTime " + 
                "FROM medicaldb.appointment " + 
                "WHERE appointment.doctorId = " + result[0].id;

                db.query(sql, (err, dateResult) => {
                    if(err) {
                        throw err;
                    }

                    let overlapping = checkIfOverlap(appointmentData.startTime, appointmentData.endTime, dateResult);

                    if(overlapping[0] == false) {
                        // If it doesn't overlap
                        let data = {
                            patientId: appointmentData.patientId,
                            doctorId: result[0].id,
                            startTime: appointmentData.startTime,
                            endTime: appointmentData.endTime
                        }

                        sql = 'UPDATE medicaldb.appointment SET ? WHERE id = ' + id;

                        // Insert the data
                        db.query(sql, data, (err, result) => {
                            if(err) {
                                throw err;
                            }

                            if(result.changedRows == 0)
                            {
                                return res.status(200).json({
                                    message: 'PUT request to /appointments/' + id,
                                    warning: 'There is no appointment with id: ' + id
                                });
                            }

                            return res.status(200).json({
                                message: 'PUT request to /appointments/' + id,
                                updatedAppointment: data
                            });
                        });
                    } else {                         
                        // If it overlaps
                        return res.status(401).json({
                            message: 'The date you input is overlapping with another...',
                            yourDate: appointmentData.startTime + " till " + appointmentData.endTime,
                            doctorDates: dateResult
                        });
                    }
                });
            });
        });
    } catch(e) {
        sendError(res, e);
    } 
};

// To DELETE appointments route
exports.delete = (req, res) => {
    try {
        if(isNaN(req.params.appointmentId))
        {
            throw new Error("The id must be a number")
        }

        let id = req.params.appointmentId;

        let sql = 'DELETE FROM medicaldb.appointment WHERE id = ' + id;

        db.query(sql, (err, result) => {
            if(err) {
                throw err;
            }

            return res.status(200).json({
                message: 'DELETE request to /appointments/' + id,
                deletedAppointment: result
            });
        }); 
    } catch(e) {
        sendError(res, e);
    }
};
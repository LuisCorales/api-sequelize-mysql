const Appointment = require("../models/appointment");
const Doctor = require("../models/doctor");
const Patient = require("../models/patient");

const Moment = require('moment');
const MomentRange = require('moment-range');
const moment = MomentRange.extendMoment(Moment);

/** If there is an error, send to response */
const sendError = (res, e) => {
    return res.status(404).json({
        message: 'There was a problem...',
        error: e.message
    });
};

/** Send the result of each request if successful */
const sendResult = (res, message, result) => {
    return res.status(200).json({
        message: message,
        result: result
    });
};

/** Asign doctor speciality and appointment duration by patient's pathology 
 * @param pathology The pathology of the patient 
 * */
const asingDoctorAndDuration = (pathology) => {
    var speciality;
    var duration;
    var str = pathology.toLowerCase();

    switch (str) {
        case "cancer":
            speciality = "oncology";
            duration = 60;
            break;

        case "leukemia": 
        case "anemia":
        case "hemophilia":
            speciality = "hematology";
            duration = 60;
            break;
        
        case "hypertension": 
        case "heart attack":
            speciality = "cardiology";
            duration = 60;
            break;
    
        default:
            speciality = "general";
            duration = 15;
            break;
    }

    return [speciality, duration];
};

/** 
 * Check if date overlaps another date from the same doctor. 
 * Returns true or false if overlaps or not, and a respective message.
 * @param startTimeNew Date 1 start.
 * @param endTimeNew Date 1 end.
 * @param id Date 1 id. Use when trying to update.
 * @param otherDates Array of JSON with other dates to compare. The JSON should include startTime, endTime, id.
 * */
const checkIfDatesOverlap = (startTimeNew, endTimeNew, id, otherDates) => {
    if(otherDates.length == 0) {   
        return [false, "There are no appointments yet!"];
    }

    // For each appointment with the same doctor, check dates
    for (let i = 0; i < otherDates.length; i++) {
        let dateStart = moment(otherDates[i].startTime);
        let dateEnd = moment(otherDates[i].endTime);
        let dateId = moment(otherDates[i].id);

        var range1 = moment().range(dateStart, dateEnd);
        var range2 = moment().range(startTimeNew, endTimeNew);

        // If it's trying to update the same appointment, don't check
        if(dateId != id){
            if((range1.contains(startTimeNew) && range1.contains(endTimeNew)) 
            || (range2.contains(dateStart) || range2.contains(dateEnd))) {
                // Overlap
                return [true, "There are dates overlapping..."];
            }
        }
    }

    return [false, "There are no overlapping dates!"];
};

/** To GET appointments route */
exports.getAll = async (req, res) => {
    try{
        let result = await Appointment.findAll({
            include: [
                {
                    association: "doctor",
                    include: {
                        association: "hospital",
                    },
                },
                {
                    association: "patient"
                }
            ]
        });

        sendResult(res, `GET request to ${req.originalUrl}`, result);
    } catch(e) {
        sendError(res, e);
    }
}

/** To POST appointments route */
exports.post = async (req, res) => {
    try{
        let patient = await Patient.findByPk(req.body.patientId);
        let speciality_duration = asingDoctorAndDuration(patient.dataValues.pathology);
        let doctor = await Doctor.findOne({
            where: {
                speciality: speciality_duration[0]
            }
        });
        let doctorId = doctor.dataValues.id;

        let endTime = moment(moment(req.body.startTime), "hh:mm:ss").add(speciality_duration[1], 'minutes');

        let otherDates = await Appointment.findAll({
            attributes: ['startTime', 'endTime', 'id'],
            where: {
                doctorId: doctorId
            }
        });

        let overlaps = checkIfDatesOverlap(moment(req.body.startTime), moment(endTime), 0, otherDates);

        if(overlaps[0]) {
            // If dates overlap send all doctors date as response
            throw new Error();
        } 

        let result = await Appointment.create({
            startTime: req.body.startTime,
            endTime: endTime,
            doctorId: doctorId,
            patientId: req.body.patientId
        });

        sendResult(res, `POST request to ${req.originalUrl}`, result);
    } catch(e) {
        sendError(res, e);
    }
}

/** To GET one appointment by id route */
exports.getAppointment = async (req, res) => {
    try{
        let result = await Appointment.findByPk(req.params.appointmentId, {
            include: [
                {
                    association: "doctor",
                    include: {
                        association: "hospital",
                    },
                },
                {
                    association: "patient"
                }
            ]
        });

        sendResult(res, `GET request to ${req.originalUrl}`, result);
    } catch(e) {
        sendError(res, e);
    }
}

/** To GET appointments of a doctor by id route */
exports.getOneDoctorAppointments = async (req, res) => {
    try{
        let result = await Appointment.findAll({
            include: [
                {
                    association: "doctor",
                    include: {
                        association: "hospital",
                    },
                },
                {
                    association: "patient"
                }
            ],
            where: {
                doctorId: req.params.doctorId
            }
        });

        sendResult(res, `GET request to ${req.originalUrl}`, result);
    } catch(e) {
        sendError(res, e);
    }
}

/** To PUT appointments route */
exports.put = async (req, res) => {
    try{
        let patient = await Patient.findByPk(req.body.patientId);
        let speciality_duration = asingDoctorAndDuration(patient.dataValues.pathology);
        let doctor = await Doctor.findOne({
            where: {
                speciality: speciality_duration[0]
            }
        });
        let doctorId = doctor.dataValues.id;

        let endTime = moment(moment(req.body.startTime), "hh:mm:ss").add(speciality_duration[1], 'minutes');

        let otherDates = await Appointment.findAll({
            attributes: ['startTime', 'endTime', 'id'],
            where: {
                doctorId: doctorId
            }
        });

        let overlaps = checkIfDatesOverlap(moment(req.body.startTime), moment(endTime), req.params.appointmentId, otherDates);

        if(overlaps[0]) {
            // If dates overlap
            throw new Error(overlaps[1]);
        } 

        let result = await Appointment.update({
            startTime: req.body.startTime,
            endTime: endTime,
            doctorId: doctorId,
            patientId: req.body.patientId
        }, {
            where: {
                id: req.params.appointmentId
            }
        });

        sendResult(res, `PUT request to ${req.originalUrl}`, `Updated rows: ${result}`);
    } catch(e) {
        sendError(res, e);
    }
}

/** To DELETE appointments route */
exports.delete = async (req, res) => {
    try{
        let result = await Appointment.destroy({
            where: {
                id: req.params.appointmentId
            }
        });

        sendResult(res, `DELETE request to ${req.originalUrl}`, `Deleted ${result} row`);
    } catch(e) {
        sendError(res, e);
    }
}
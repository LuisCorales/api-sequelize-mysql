const { Appointment, Doctor, Patient } = require('../db/models/index');

const Moment = require('moment');
const MomentRange = require('moment-range');
const moment = MomentRange.extendMoment(Moment);

/** If there is an error, send to response */
const sendError = (res, e) => {
    return res.status(500).json({
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
module.exports.getAll = async (req, res) => {
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
module.exports.post = async (req, res) => {
    try{
        let patient = await Patient.findByPk(req.body.patient_id);
        let speciality_duration = asingDoctorAndDuration(patient.dataValues.pathology);
        let doctor = await Doctor.findOne({
            where: {
                speciality: speciality_duration[0]
            }
        });
        let doctor_id = doctor.dataValues.id;

        let end_time = moment(moment(req.body.start_time), "hh:mm:ss").add(speciality_duration[1], 'minutes');

        let otherDates = await Appointment.findAll({
            attributes: ['start_time', 'end_time', 'id'],
            where: {
                doctor_id: doctor_id
            }
        });

        let overlaps = checkIfDatesOverlap(moment(req.body.start_time), moment(end_time), 0, otherDates);

        if(overlaps[0]) {
            // If dates overlap send all doctors date as response
            throw new Error(overlaps[1]);
        } 

        let result = await Appointment.create({
            start_time: req.body.start_time,
            end_time: end_time,
            doctor_id: doctor_id,
            patient_id: req.body.patient_id
        });

        sendResult(res, `POST request to ${req.originalUrl}`, result);
    } catch(e) {
        sendError(res, e);
    }
}

/** To GET one appointment by id route */
module.exports.getAppointment = async (req, res) => {
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
module.exports.getOneDoctorAppointments = async (req, res) => {
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
                doctor_id: req.params.doctor_id
            }
        });

        sendResult(res, `GET request to ${req.originalUrl}`, result);
    } catch(e) {
        sendError(res, e);
    }
}

/** To PUT appointments route */
module.exports.put = async (req, res) => {
    try{
        let patient = await Patient.findByPk(req.body.patient_id);
        let speciality_duration = asingDoctorAndDuration(patient.dataValues.pathology);
        let doctor = await Doctor.findOne({
            where: {
                speciality: speciality_duration[0]
            }
        });
        let doctor_id = doctor.dataValues.id;

        let end_time = moment(moment(req.body.start_time), "hh:mm:ss").add(speciality_duration[1], 'minutes');

        let otherDates = await Appointment.findAll({
            attributes: ['start_time', 'end_time', 'id'],
            where: {
                doctor_id: doctor_id
            }
        });

        let overlaps = checkIfDatesOverlap(moment(req.body.start_time), moment(end_time), req.params.appointmentId, otherDates);

        if(overlaps[0]) {
            // If dates overlap
            throw new Error(overlaps[1]);
        } 

        let result = await Appointment.update({
            start_time: req.body.start_time,
            end_time: end_time,
            doctor_id: doctor_id,
            patient_id: req.body.patient_id
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
module.exports.delete = async (req, res) => {
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
const Appointment = require("../models/appointment");

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

/** Asign doctor speciality by patient's pathology 
 * @param pathology The pathology of the patient */
const asingDoctor = (pathology) => {
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

/** Check if the duration of the appointment is correct */
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

/** Check if date overlaps another date from the same doctor */
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

        sendResult(res, "GET request to /appointments/", result);
    } catch(e) {
        sendError(res, e);
    }
}

/** To POST appointments route */
exports.post = async (req, res) => {
    try{    
        let result = await Appointment.create({
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            doctorId: req.body.doctorId,
            patientId: req.body.patientId
        });

        sendResult(res, "POST request to /appointments/", result);
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

        sendResult(res, "GET request to /appointments/" + req.params.doctorId, result);
    } catch(e) {
        sendError(res, e);
    }
}

/** To PUT appointments route */
exports.put = async (req, res) => {
    try{
        let result = await Appointment.update({
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            doctorId: req.body.doctorId,
            patientId: req.body.patientId
        }, {
            where: {
                id: req.params.appointmentId
            }
        });

        sendResult(res, "PUT request to /appointments/" + req.params.appointmentId, `Updated ${result} row`);
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

        sendResult(res, "DELETE request to /appointments/" + req.params.appointmentId, `Deleted ${result} row`);
    } catch(e) {
        sendError(res, e);
    }
}
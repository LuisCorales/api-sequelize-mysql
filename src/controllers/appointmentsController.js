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
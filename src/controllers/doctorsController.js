const Doctor = require("../db/models/doctor");

// If there is an error, send to response
const sendError = (res, e) => {
    return res.status(404).json({
        message: 'There was a problem...',
        error: e.message
    });
};

// Send the result of each request if successful
const sendResult = (res, message, result) => {
    return res.status(200).json({
        message: message,
        result: result
    });
};

exports.getAll = async (req, res) => {
    try{
        let result = await Doctor.findAll({
            include: {
                association: "hospital",
                attributes: ['name']
            }
        });

        sendResult(res, "GET request to /doctors/", result);
    } catch(e) {
        sendError(res, e);
    }
}

exports.post = async (req, res) => {
    try{    
        let result = await Doctor.create({
            firstName: req.body.firstName,
            surname: req.body.surname,
            speciality: req.body.speciality,
            hospitalId: req.body.hospitalId
        });

        sendResult(res, "POST request to /doctors/", result);
    } catch(e) {
        sendError(res, e);
    }
}

exports.getOne = async (req, res) => {
    try{
        let result = await Doctor.findByPk(req.params.id);

        sendResult(res, "GET request to /doctors/" + req.params.id, result);
    } catch(e) {
        sendError(res, e);
    }
}

exports.put = async (req, res) => {
    try{
        let result = await Doctor.update({
            firstName: req.body.firstName,
            surname: req.body.surname,
            speciality: req.body.speciality
        }, {
            where: {
                id: req.params.id
            }
        });

        sendResult(res, "PUT request to /doctors/" + req.params.id, `Updated ${result} row`);
    } catch(e) {
        sendError(res, e);
    }
}

exports.delete = async (req, res) => {
    try{
        let result = await Doctor.destroy({
            where: {
                id: req.params.id
            }
        });

        sendResult(res, "DELETE request to /doctors/" + req.params.id, `Deleted ${result} row`);
    } catch(e) {
        sendError(res, e);
    }
}
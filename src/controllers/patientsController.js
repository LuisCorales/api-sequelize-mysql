const Patient = require("../models/patient");

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
        let result = await Patient.findAll();

        sendResult(res, "GET request to /patients/", result);
    } catch(e) {
        sendError(res, e);
    }
}

exports.post = async (req, res) => {
    try{
        let result = await Patient.create({
            firstName: req.body.firstName,
            surname: req.body.surname,
            idDocument: req.body.idDocument,
            pathology: req.body.pathology
        });
        //Preguntar a daniel si esto es la misma velocidad que hacer un return aqui
        sendResult(res, "POST request to /patients/", result);
    } catch(e) {
        sendError(res, e);
    }
}

exports.getOne = async (req, res) => {
    try{
        let result = await Patient.findByPk(req.params.id);

        sendResult(res, "GET request to /patients/" + req.params.id, result);
    } catch(e) {
        sendError(res, e);
    }
}

exports.put = async (req, res) => {
    try{
        let result = await Patient.update({
            firstName: req.body.firstName,
            surname: req.body.surname,
            idDocument: req.body.idDocument,
            pathology: req.body.pathology
        }, {
            where: {
                id: req.params.id
            }
        });
        
        sendResult(res, "PUT request to /patients/" + req.params.id, `Updated ${result} row`);
    } catch(e) {
        sendError(res, e);
    }
}

exports.delete = async (req, res) => {
    try{
        let result = await Patient.destroy({
            where: {
                id: req.params.id
            }
        });

        sendResult(res, "DELETE request to /patients/" + req.params.id, `Deleted ${result} row`);
    } catch(e) {
        sendError(res, e);
    }
}
const Hospital = require("../models/hospital");

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
        let result = await Hospital.findAll();

        sendResult(res, "GET request to /hospitals/", result);
    } catch(e) {
        sendError(res, e);
    }
}

exports.post = async (req, res) => {
    try{    
        let result = await Hospital.create({
            name: req.body.name
        });

        sendResult(res, "POST request to /hospitals/", result);
    } catch(e) {
        sendError(res, e);
    }
}

exports.getOne = async (req, res) => {
    try{
        let result = await Hospital.findByPk(req.params.id);

        sendResult(res, "GET request to /hospitals/" + req.params.id, result);
    } catch(e) {
        sendError(res, e);
    }
}

exports.put = async (req, res) => {
    try{
        let result = await Hospital.update({
            name: req.body.name
        }, {
            where: {
                id: req.params.id
            }
        });

        sendResult(res, "PUT request to /hospitals/" + req.params.id, `Updated ${result} row`);
    } catch(e) {
        sendError(res, e);
    }
}

exports.delete = async (req, res) => {
    try{
        let result = await Hospital.destroy({
            where: {
                id: req.params.id
            }
        });

        sendResult(res, "DELETE request to /hospitals/" + req.params.id, `Deleted ${result} row`);
    } catch(e) {
        sendError(res, e);
    }
}
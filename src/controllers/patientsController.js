const { Patient } = require('../db/models/index');

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

/** To GET patients route */
module.exports.getAll = async (req, res) => {
    try{
        let result = await Patient.findAll();

        sendResult(res, `GET request to ${req.originalUrl}`, result);
    } catch(e) {
        sendError(res, e);
    }
}

/** To POST patients route */
module.exports.post = async (req, res) => {
    try{
        const patients = await Patient.findAll({
            where: {
                id_document: req.body.id_document
            }
        });

        if(patients == 0) {
            var result = await Patient.create({
                firstname: req.body.firstname,
                surname: req.body.surname,
                id_document: req.body.id_document,
                pathology: req.body.pathology
            });
        } else {
            var result = await Patient.update({
                pathology: req.body.pathology
            }, {
                where: {
                    id_document: req.body.id_document
                }
            });
        }
        
        //Preguntar a daniel si esto es la misma velocidad que hacer un return aqui
        sendResult(res, `POST request to ${req.originalUrl}`, result);
    } catch(e) {
        sendError(res, e);
    }
}

/** To GET patients by id route */
module.exports.getOne = async (req, res) => {
    try{
        let result = await Patient.findByPk(req.params.id);

        sendResult(res, `GET request to ${req.originalUrl}`, result);
    } catch(e) {
        sendError(res, e);
    }
}

/** To PUT patients route */
module.exports.put = async (req, res) => {
    try{
        let result = await Patient.update({
            pathology: req.body.pathology
        }, {
            where: {
                id: req.params.id
            }
        });
        
        sendResult(res, `PUT request to ${req.originalUrl}`, `Updated ${result} row`);
    } catch(e) {
        sendError(res, e);
    }
}

/** To DELETE patients route */
module.exports.delete = async (req, res) => {
    try{
        let result = await Patient.destroy({
            where: {
                id: req.params.id
            }
        });

        sendResult(res, `DELETE request to ${req.originalUrl}`, `Deleted ${result} row`);
    } catch(e) {
        sendError(res, e);
    }
}
const { Doctor } = require('../db/models/index');

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

/** To GET doctors route */
module.exports.getAll = async (req, res) => {
    try{
        let result = await Doctor.findAll({
            include: {
                association: "hospital",
                attributes: ['name']
            }
        });

        sendResult(res, `GET request to ${req.originalUrl}`, result);
    } catch(e) {
        sendError(res, e);
    }
}

/** To POST doctors route */
module.exports.post = async (req, res) => {
    try{    
        let result = await Doctor.create({
            firstname: req.body.firstname,
            surname: req.body.surname,
            speciality: req.body.speciality,
            hospital_id: req.body.hospital_id
        });

        sendResult(res, `POST request to ${req.originalUrl}`, result);
    } catch(e) {
        sendError(res, e);
    }
}

/** To GET doctor by id route */
module.exports.getOne = async (req, res) => {
    try{
        let result = await Doctor.findByPk(req.params.id, {
            include: {
                association: "hospital",
                attributes: ['name']
            }
        });

        sendResult(res, `GET request to ${req.originalUrl}`, result);
    } catch(e) {
        sendError(res, e);
    }
}

/** To PUT doctors route */
module.exports.put = async (req, res) => {
    try{
        let result = await Doctor.update({
            firstname: req.body.firstname,
            surname: req.body.surname,
            speciality: req.body.speciality,
            hospital_id: req.body.hospital_id
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

/** To DELETE doctors route */
module.exports.delete = async (req, res) => {
    try{
        let result = await Doctor.destroy({
            where: {
                id: req.params.id
            }
        });

        sendResult(res, `DELETE request to ${req.originalUrl}`, `Deleted ${result} row`);
    } catch(e) {
        sendError(res, e);
    }
}
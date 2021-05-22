const { Hospital } = require('../db/models/index');

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

/** To GET hospitals route */
module.exports.getAll = async (req, res) => {
    try{
        let result = await Hospital.findAll();

        sendResult(res, `GET request to ${req.originalUrl}`, result);
    } catch(e) {
        sendError(res, e);
    }
}

/** To POST hospitals route */
module.exports.post = async (req, res) => {
    try{    
        let result = await Hospital.create({
            name: req.body.name
        });

        sendResult(res, `POST request to ${req.originalUrl}`, result);
    } catch(e) {
        sendError(res, e);
    }
}

/** To GET hospitals by id route */
module.exports.getOne = async (req, res) => {
    try{
        let result = await Hospital.findByPk(req.params.id);

        sendResult(res, `GET request to ${req.originalUrl}`, result);
    } catch(e) {
        sendError(res, e);
    }
}

/** To PUT hospitals route */
module.exports.put = async (req, res) => {
    try{
        let result = await Hospital.update({
            name: req.body.name
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

/** To DELETE hospitals route */
module.exports.delete = async (req, res) => {
    try{
        let result = await Hospital.destroy({
            where: {
                id: req.params.id
            }
        });

        sendResult(res, `DELETE request to ${req.originalUrl}`, `Deleted ${result} row`);
    } catch(e) {
        sendError(res, e);
    }
}
const {constants} = require('../constant')

const errorHandler = (err, req, res, next) =>{
    const statusCode = res.statusCode ? res.statusCode : 500
    switch (statusCode){
        case constants.INTERNAL_SERVER_ERROR:
            res.status(500).json({
                title: 'Internal Server Error',
                message: err.message,
                stackTrace: err.stack
            })
            break;
        case constants.NOT_FOUND:
            res.status(404).json({
                title : "Not Found",
                message: err.message,
                stackTrace: err.stack
            })
            break;
        case constants.BAD_REQUEST:
            res.status(400).json({
                title: 'Bad Request',
                message: err.message,
                stackTrace: err.stack
            })
            break;
        case constants.UNAUTHORIZED:
            res.status(401).json({
                title: 'Unauthorized',
                message: err.message,
                stackTrace: err.stack
            })
            break;
        case constants.FORBIDDEN:
            res.status(403).json({
                title: 'Forbidden',
                message: err.message,
                stackTrace: err.stack
            })
            break;

        default:
            res.status(statusCode).json({
                message: err.message
            })
            break;
    }
}

module.exports = errorHandler
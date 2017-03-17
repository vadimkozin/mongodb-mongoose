var winston = require('winston');

winston.emitErrs = true;
function logger(module) {

    return new winston.Logger({
        transports : [
            new winston.transports.File({
                level: 'info',
                filename: process.cwd() + '/logs/all.log',
                handleException: true,
                json: true,
                maxSize: 1048576, //1mb 
                maxFiles: 5, 
                colorize: false
            }),
            new winston.transports.Console({
                level: 'info',
                label: getFilePath(module),
                handleException: true,
                json: false,
                colorize: true
            })
        ],
        exitOnError: false
    });
}

function getFilePath (module ) {
    return module.filename.split('/').slice(-2).join('/');
}

module.exports = logger;

const winston = require('winston');

const winstonLogger = winston.createLogger({
    level: 'info',
    format: winston.format.prettyPrint(),
    transports: new winston.transports.Console()
});

module.exports = winstonLogger;
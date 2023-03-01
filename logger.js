const winston = require('winston');

const { combine, timestamp, printf, colorize } = winston.format;

const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level.toUpperCase()} ${message}`;
});

const colors = {
    ERROR: 'red',
    WARN: 'yellow',
    INFO: 'green'
}

winston.addColors(colors);

const logger = winston.createLogger({

    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        colorize({ all: true }),
        logFormat,
    ),
    transports: [
        new winston.transports.Console({
            handleExceptions: true,
        })
    ]
});

module.exports = logger;

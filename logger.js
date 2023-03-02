const winston = require('winston');

const { combine, timestamp, printf, colorize } = winston.format;

const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [ ${level} ] ${message}`;
});

const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green'
}

winston.addColors(colors);

const logger = winston.createLogger({
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        colorize({ all: true }),
        logFormat
    ),
    transports: [
        new winston.transports.Console()
    ]
});

module.exports = logger;

const { createLogger, format, transports } = require("winston");
const path = require("path");

const logFormat = format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
        return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
);

const logger = createLogger({
    level: "info",
    format: logFormat,
    transports: [
        // Console
        new transports.Console(),

        // All logs
        new transports.File({
            filename: path.join(__dirname, "../logs/combined.log"),
        }),

        // Errors only
        new transports.File({
            filename: path.join(__dirname, "../logs/error.log"),
            level: "error",
        }),
    ],
});

module.exports = logger;
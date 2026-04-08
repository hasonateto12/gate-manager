const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: "Too many requests",
        details: "Please try again later.",
    },
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: "Too many login attempts",
        details: "Please try again again later.",
    },
});

const securityHeaders = helmet();

module.exports = {
    securityHeaders,
    generalLimiter,
    authLimiter,
};
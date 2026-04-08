const { query } = require("express-validator");

const getEntryLogsValidation = [
    query("vehicle_id")
        .optional()
        .isInt({ min: 1 })
        .withMessage("vehicle_id must be a positive integer"),

    query("employee_id")
        .optional()
        .isInt({ min: 1 })
        .withMessage("employee_id must be a positive integer"),

    query("result")
        .optional()
        .isIn(["approved", "rejected", "pending"])
        .withMessage("result must be approved, rejected, or pending"),

    query("from")
        .optional()
        .isISO8601()
        .withMessage("from must be a valid date"),

    query("to")
        .optional()
        .isISO8601()
        .withMessage("to must be a valid date"),
];

module.exports = {
    getEntryLogsValidation,
};
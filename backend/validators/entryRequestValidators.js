const { body, param } = require("express-validator");

const entryRequestIdValidation = [
    param("id")
        .notEmpty()
        .withMessage("Request ID is required")
        .isInt({ min: 1 })
        .withMessage("Request ID must be a positive integer"),
];

const createEntryRequestValidation = [
    body("vehicle_id")
        .notEmpty()
        .withMessage("Vehicle ID is required")
        .isInt({ min: 1 })
        .withMessage("Vehicle ID must be a positive integer"),

    body("notes")
        .optional({ values: "falsy" })
        .trim()
        .isLength({ max: 500 })
        .withMessage("Notes must not exceed 500 characters"),
];

const updateEntryRequestStatusValidation = [
    body("status")
        .notEmpty()
        .withMessage("Status is required")
        .isIn(["approved", "rejected"])
        .withMessage("Status must be approved or rejected"),

    body("rejection_reason")
        .optional({ values: "falsy" })
        .trim()
        .isLength({ max: 500 })
        .withMessage("Rejection reason must not exceed 500 characters"),
];

module.exports = {
    entryRequestIdValidation,
    createEntryRequestValidation,
    updateEntryRequestStatusValidation,
};
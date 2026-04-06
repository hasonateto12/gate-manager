const { body, param } = require("express-validator");

const employeeIdValidation = [
    param("id")
        .notEmpty()
        .withMessage("Employee ID is required")
        .isInt({ min: 1 })
        .withMessage("Employee ID must be a positive integer"),
];

const createEmployeeValidation = [
    body("full_name")
        .trim()
        .notEmpty()
        .withMessage("Full name is required")
        .isLength({ min: 2, max: 100 })
        .withMessage("Full name must be between 2 and 100 characters"),

    body("phone")
        .optional({ values: "falsy" })
        .trim()
        .isLength({ min: 7, max: 20 })
        .withMessage("Phone number must be between 7 and 20 characters"),

    body("role")
        .optional({ values: "falsy" })
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage("Role must be between 2 and 50 characters"),
];

const updateEmployeeValidation = [
    param("id")
        .notEmpty()
        .withMessage("Employee ID is required")
        .isInt({ min: 1 })
        .withMessage("Employee ID must be a positive integer"),

    body("full_name")
        .trim()
        .notEmpty()
        .withMessage("Full name is required")
        .isLength({ min: 2, max: 100 })
        .withMessage("Full name must be between 2 and 100 characters"),

    body("phone")
        .optional({ values: "falsy" })
        .trim()
        .isLength({ min: 7, max: 20 })
        .withMessage("Phone number must be between 7 and 20 characters"),

    body("role")
        .optional({ values: "falsy" })
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage("Role must be between 2 and 50 characters"),
];

module.exports = {
    employeeIdValidation,
    createEmployeeValidation,
    updateEmployeeValidation,
};
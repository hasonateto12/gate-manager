const { body, param } = require("express-validator");

const vehicleIdValidation = [
    param("id")
        .notEmpty()
        .withMessage("Vehicle ID is required")
        .isInt({ min: 1 })
        .withMessage("Vehicle ID must be a positive integer"),
];

const createVehicleValidation = [
    body("employee_id")
        .notEmpty()
        .withMessage("Employee ID is required")
        .isInt({ min: 1 })
        .withMessage("Employee ID must be a positive integer"),

    body("plate_number")
        .trim()
        .notEmpty()
        .withMessage("Plate number is required")
        .isLength({ min: 2, max: 20 })
        .withMessage("Plate number must be between 2 and 20 characters"),

    body("vehicle_type")
        .optional({ values: "falsy" })
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage("Vehicle type must be between 2 and 50 characters"),

    body("color")
        .optional({ values: "falsy" })
        .trim()
        .isLength({ min: 2, max: 30 })
        .withMessage("Color must be between 2 and 30 characters"),
];

const updateVehicleValidation = [
    body("employee_id")
        .notEmpty()
        .withMessage("Employee ID is required")
        .isInt({ min: 1 })
        .withMessage("Employee ID must be a positive integer"),

    body("plate_number")
        .trim()
        .notEmpty()
        .withMessage("Plate number is required")
        .isLength({ min: 2, max: 20 })
        .withMessage("Plate number must be between 2 and 20 characters"),

    body("vehicle_type")
        .optional({ values: "falsy" })
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage("Vehicle type must be between 2 and 50 characters"),

    body("color")
        .optional({ values: "falsy" })
        .trim()
        .isLength({ min: 2, max: 30 })
        .withMessage("Color must be between 2 and 30 characters"),
];

module.exports = {
    vehicleIdValidation,
    createVehicleValidation,
    updateVehicleValidation,
};
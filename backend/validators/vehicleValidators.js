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
        .optional({ values: "falsy" })
        .isInt({ min: 1 })
        .withMessage("Employee ID must be a positive integer"),

    body("plate_number")
        .trim()
        .notEmpty()
        .withMessage("Plate number is required")
        .isLength({ min: 2, max: 20 }),

    body("vehicle_type")
        .optional({ values: "falsy" })
        .trim(),

    body("color")
        .optional({ values: "falsy" })
        .trim(),
];

const updateVehicleValidation = [
    body("employee_id")
        .optional({ values: "falsy" })
        .isInt({ min: 1 })
        .withMessage("Employee ID must be a positive integer"),

    body("plate_number")
        .trim()
        .notEmpty()
        .withMessage("Plate number is required")
        .isLength({ min: 2, max: 20 }),

    body("vehicle_type")
        .optional({ values: "falsy" })
        .trim(),

    body("color")
        .optional({ values: "falsy" })
        .trim(),
];

module.exports = {
    vehicleIdValidation,
    createVehicleValidation,
    updateVehicleValidation,
};
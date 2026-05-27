const express = require("express");
const router = express.Router();

const db = require("../config/db");

const verifyToken = require("../middleware/authMiddleware");
const verifyAdmin = require("../middleware/roleMiddleware");

const handleValidationErrors = require("../middleware/validationMiddleware");

const {
    createVehicleValidation,
    updateVehicleValidation,

} = require("../validators/vehicleValidators");


/* =========================
   GET ALL VEHICLES
========================= */
router.get(
    "/",
    verifyToken,
    (req, res) => {

        const sql = `
            SELECT
                vehicles.*,
                employees.full_name
            FROM vehicles
                     LEFT JOIN employees
                               ON vehicles.employee_id = employees.id
            ORDER BY vehicles.id DESC
        `;

        db.query(sql, (err, resultData) => {

            if (err) {

                console.log("GET VEHICLES error:", err);

                return res.status(500).json({
                    error: "Database error",
                });
            }

            res.json(resultData);
        });
    }
);


/* =========================
   CHECK VEHICLE BY PLATE
========================= */
router.get(
    "/plate/:plate",
    verifyToken,
    (req, res) => {

        const { plate } = req.params;

        const sql = `
            SELECT
                vehicles.*,
                employees.full_name
            FROM vehicles
                     LEFT JOIN employees
                               ON vehicles.employee_id = employees.id
            WHERE vehicles.plate_number = ?
        `;

        db.query(sql, [plate], (err, resultData) => {

            if (err) {

                console.log("CHECK VEHICLE error:", err);

                return res.status(500).json({
                    error: "Database error",
                });
            }

            if (resultData.length === 0) {

                return res.status(404).json({
                    error: "Vehicle not found",
                });
            }

            res.json(resultData[0]);
        });
    }
);


/* =========================
   CREATE VEHICLE
========================= */
router.post(
    "/",
    verifyToken,
    verifyAdmin,
    createVehicleValidation,
    handleValidationErrors,
    (req, res) => {

        const {
            plate_number,
            vehicle_type,
            employee_id,
            status,
        } = req.body;

        const sql = `
            INSERT INTO vehicles
            (
                plate_number,
                vehicle_type,
                employee_id,
                status
            )
            VALUES (?, ?, ?, ?)
        `;

        db.query(
            sql,
            [
                plate_number,
                vehicle_type,
                employee_id,
                status || "approved",
            ],
            (err, resultData) => {

                if (err) {

                    console.log("CREATE VEHICLE error:", err);

                    return res.status(500).json({
                        error: "Database error",
                        details: err.message,
                    });
                }

                res.status(201).json({
                    message: "Vehicle created successfully",
                    id: resultData.insertId,
                });
            }
        );
    }
);


/* =========================
   UPDATE VEHICLE
========================= */
router.put(
    "/:id",
    verifyToken,
    verifyAdmin,
    updateVehicleValidation,
    handleValidationErrors,
    (req, res) => {

        const { id } = req.params;

        const {
            plate_number,
            vehicle_type,
            employee_id,
            status,
        } = req.body;

        const sql = `
            UPDATE vehicles
            SET
                plate_number = ?,
                vehicle_type = ?,
                employee_id = ?,
                status = ?
            WHERE id = ?
        `;

        db.query(
            sql,
            [
                plate_number,
                vehicle_type,
                employee_id,
                status,
                id,
            ],
            (err, resultData) => {

                if (err) {

                    console.log("UPDATE VEHICLE error:", err);

                    return res.status(500).json({
                        error: "Database error",
                        details: err.message,
                    });
                }

                if (resultData.affectedRows === 0) {

                    return res.status(404).json({
                        error: "Vehicle not found",
                    });
                }

                res.json({
                    message: "Vehicle updated successfully",
                });
            }
        );
    }
);


/* =========================
   DELETE VEHICLE
========================= */
router.delete(
    "/:id",
    verifyToken,
    verifyAdmin,
    (req, res) => {

        const { id } = req.params;

        const sql = `
            DELETE FROM vehicles
            WHERE id = ?
        `;

        db.query(sql, [id], (err, resultData) => {

            if (err) {

                console.log("DELETE VEHICLE error:", err);

                return res.status(500).json({
                    error: "Database error",
                    details: err.message,
                });
            }

            if (resultData.affectedRows === 0) {

                return res.status(404).json({
                    error: "Vehicle not found",
                });
            }

            res.json({
                message: "Vehicle deleted successfully",
            });
        });
    }
);


/* =========================
   CHECK VEHICLE
========================= */
router.get(
    "/check/:plate",
    verifyToken,
    (req, res) => {

        const { plate } = req.params;

        const sql = `
            SELECT
                v.*,
                e.full_name
            FROM vehicles v

            LEFT JOIN employees e
                ON v.employee_id = e.id

            WHERE v.plate_number = ?
        `;

        db.query(sql, [plate], (err, resultData) => {

            if (err) {

                console.log(
                    "CHECK VEHICLE error:",
                    err
                );

                return res.status(500).json({
                    error: "Failed to check vehicle",
                });
            }

            // רכב לא קיים
            if (resultData.length === 0) {

                return res.status(404).json({
                    exists: false,
                    message: "Vehicle not found",
                });
            }

            // רכב קיים
            res.json({
                exists: true,
                vehicle: resultData[0],
            });
        });
    }
);

module.exports = router;
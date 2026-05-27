const express = require("express");

const router = express.Router();

const db = require("../config/db");

const verifyToken = require("../middleware/authMiddleware");

const verifyAdmin = require("../middleware/roleMiddleware");

/* =========================
   GET ALL VEHICLES
========================= */
router.get(
    "/",
    verifyToken,
    verifyAdmin,
    (req, res) => {

        const sql = `
            SELECT *
            FROM vehicles
            ORDER BY id DESC
        `;

        db.query(sql, (err, result) => {

            if (err) {

                console.log("GET VEHICLES ERROR:", err);

                return res.status(500).json({
                    error: "Failed to fetch vehicles",
                });
            }

            res.json(result);
        });
    }
);

/* =========================
   CHECK VEHICLE
========================= */
router.get(
    "/check/:plateNumber",
    verifyToken,
    (req, res) => {

        const { plateNumber } = req.params;

        const sql = `
            SELECT *
            FROM vehicles
            WHERE plate_number = ?
                LIMIT 1
        `;

        db.query(sql, [plateNumber], (err, result) => {

            if (err) {

                console.log("CHECK VEHICLE ERROR:", err);

                return res.status(500).json({
                    error: "Database error",
                });
            }

            // NOT FOUND
            if (result.length === 0) {

                return res.json({
                    exists: false,
                });
            }

            // FOUND
            res.json({
                exists: true,
                vehicle: result[0],
            });
        });
    }
);

/* =========================
   ADD VEHICLE
========================= */
router.post(
    "/",
    verifyToken,
    verifyAdmin,
    (req, res) => {

        const {
            plate_number,
            vehicle_type,
            employee_id,
            driver_name,
            company_name,
            status,
        } = req.body;

        const sql = `
            INSERT INTO vehicles
            (
                plate_number,
                vehicle_type,
                employee_id,
                driver_name,
                company_name,
                status
            )
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        db.query(
            sql,
            [
                plate_number,
                vehicle_type,
                employee_id,
                driver_name,
                company_name,
                status || "approved",
            ],
            (err, result) => {

                if (err) {

                    console.log("ADD VEHICLE ERROR:", err);

                    return res.status(500).json({
                        error: "Failed to add vehicle",
                    });
                }

                res.status(201).json({
                    message: "Vehicle added successfully",
                    id: result.insertId,
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
    (req, res) => {

        const { id } = req.params;

        const {
            plate_number,
            vehicle_type,
            employee_id,
            driver_name,
            company_name,
            status,
        } = req.body;

        const sql = `
            UPDATE vehicles
            SET
                plate_number = ?,
                vehicle_type = ?,
                employee_id = ?,
                driver_name = ?,
                company_name = ?,
                status = ?
            WHERE id = ?
        `;

        db.query(
            sql,
            [
                plate_number,
                vehicle_type,
                employee_id,
                driver_name,
                company_name,
                status,
                id,
            ],
            (err, result) => {

                if (err) {

                    console.log("UPDATE VEHICLE ERROR:", err);

                    return res.status(500).json({
                        error: "Failed to update vehicle",
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

        db.query(sql, [id], (err, result) => {

            if (err) {

                console.log("DELETE VEHICLE ERROR:", err);

                return res.status(500).json({
                    error: "Failed to delete vehicle",
                });
            }

            res.json({
                message: "Vehicle deleted successfully",
            });
        });
    }
);

module.exports = router;
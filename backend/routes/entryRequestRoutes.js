const express = require("express");
const router = express.Router();

const db = require("../config/db");

const verifyToken = require("../middleware/authMiddleware");
const verifyAdmin = require("../middleware/roleMiddleware");

const handleValidationErrors = require("../middleware/validationMiddleware");

const {
    createEntryRequestValidation,
} = require("../validators/entryRequestValidators");


/* =========================
   CREATE REQUEST
========================= */
router.post(
    "/",
    verifyToken,
    createEntryRequestValidation,
    handleValidationErrors,
    (req, res) => {

        const {
            vehicle_id,
            employee_id,
            reason,
            notes,
        } = req.body;

        const sql = `
            INSERT INTO entry_requests
            (
                vehicle_id,
                employee_id,
                reason,
                status,
                created_by,
                request_time,
                notes
            )
            VALUES (?, ?, ?, 'pending', ?, NOW(), ?)
        `;

        db.query(
            sql,
            [
                vehicle_id || null,
                employee_id || null,
                reason,
                req.user.id,
                notes || null,
            ],
            (err, resultData) => {

                if (err) {

                    console.log(
                        "CREATE REQUEST error:",
                        err
                    );

                    return res.status(500).json({
                        error: "Failed to create request",
                        details: err.message,
                    });
                }

                res.status(201).json({
                    message: "Request created successfully",
                    id: resultData.insertId,
                });
            }
        );
    }
);


/* =========================
   GET REQUESTS
========================= */
router.get(
    "/",
    verifyToken,
    (req, res) => {

        let sql = "";
        let params = [];

        // ADMIN
        if (req.user.role === "admin") {

            sql = `
                SELECT
                    er.*,
                    v.plate_number,
                    e.full_name
                FROM entry_requests er

                         LEFT JOIN vehicles v
                                   ON er.vehicle_id = v.id

                         LEFT JOIN employees e
                                   ON er.employee_id = e.id

                WHERE er.status = 'pending'

                ORDER BY er.id DESC
            `;
        }

        // GUARD
        else {

            sql = `
                SELECT
                    er.*,
                    v.plate_number,
                    e.full_name
                FROM entry_requests er

                         LEFT JOIN vehicles v
                                   ON er.vehicle_id = v.id

                         LEFT JOIN employees e
                                   ON er.employee_id = e.id

                WHERE er.created_by = ?

                ORDER BY er.id DESC
            `;

            params.push(req.user.id);
        }

        db.query(sql, params, (err, resultData) => {

            if (err) {

                console.log(
                    "GET REQUESTS error:",
                    err
                );

                return res.status(500).json({
                    error: "Failed to fetch requests",
                    details: err.message,
                });
            }

            res.json(resultData);
        });
    }
);


/* =========================
   APPROVE REQUEST
========================= */
router.put(
    "/:id/approve",
    verifyToken,
    verifyAdmin,
    (req, res) => {

        const { id } = req.params;

        // UPDATE REQUEST
        const updateSql = `
            UPDATE entry_requests
            SET
                status = 'approved',
                approved_by = ?
            WHERE id = ?
        `;

        db.query(
            updateSql,
            [req.user.id, id],
            (updateErr) => {

                if (updateErr) {

                    console.log(
                        "APPROVE REQUEST error:",
                        updateErr
                    );

                    return res.status(500).json({
                        error: "Failed to approve request",
                    });
                }

                // GET REQUEST DATA
                const fetchSql = `
                    SELECT *
                    FROM entry_requests
                    WHERE id = ?
                `;

                db.query(
                    fetchSql,
                    [id],
                    (fetchErr, requestData) => {

                        if (fetchErr) {

                            return res.status(500).json({
                                error: "Failed to fetch request",
                            });
                        }

                        const request = requestData[0];

                        // INSERT VEHICLE
                        const vehicleSql = `
                            INSERT INTO vehicles
                            (
                                plate_number,
                                vehicle_type,
                                employee_id,
                                status
                            )
                            VALUES (?, ?, ?, 'approved')
                        `;

                        db.query(
                            vehicleSql,
                            [
                                request.plate_number || null,
                                "פרטי",
                                request.employee_id || null,
                            ],
                            (vehicleErr) => {

                                if (vehicleErr) {

                                    console.log(
                                        "CREATE VEHICLE error:",
                                        vehicleErr
                                    );

                                    return res.status(500).json({
                                        error: "Request approved but failed to create vehicle",
                                    });
                                }

                                res.json({
                                    message: "Request approved successfully",
                                });
                            }
                        );
                    }
                );
            }
        );
    }
);


/* =========================
   REJECT REQUEST
========================= */
router.put(
    "/:id/reject",
    verifyToken,
    verifyAdmin,
    (req, res) => {

        const { id } = req.params;

        const sql = `
            UPDATE entry_requests
            SET
                status = 'rejected',
                approved_by = ?
            WHERE id = ?
        `;

        db.query(
            sql,
            [req.user.id, id],
            (err, resultData) => {

                if (err) {

                    console.log(
                        "REJECT REQUEST error:",
                        err
                    );

                    return res.status(500).json({
                        error: "Failed to reject request",
                    });
                }

                res.json({
                    message: "Request rejected successfully",
                });
            }
        );
    }
);

module.exports = router;
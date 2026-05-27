const express = require("express");

const router = express.Router();

const db = require("../config/db");

const verifyToken = require("../middleware/authMiddleware");

const verifyAdmin = require("../middleware/roleMiddleware");

/* =========================
   CREATE ENTRY REQUEST
========================= */
router.post(
    "/",
    verifyToken,
    (req, res) => {

        const {
            plate_number,
            driver_name,
            company_name,
            notes,
        } = req.body;

        const sql = `
            INSERT INTO entry_requests
            (
                plate_number,
                driver_name,
                company_name,
                notes,
                status,
                request_time
            )
            VALUES (?, ?, ?, ?, 'pending', NOW())
        `;

        db.query(
            sql,
            [
                plate_number,
                driver_name,
                company_name,
                notes,
            ],
            (err, result) => {

                if (err) {

                    console.log(
                        "CREATE REQUEST ERROR:",
                        err
                    );

                    return res.status(500).json({
                        error: "Failed to create request",
                    });
                }

                res.status(201).json({
                    message:
                        "Request created successfully",
                });
            }
        );
    }
);

/* =========================
   GET PENDING REQUESTS
========================= */
router.get(
    "/",
    verifyToken,
    verifyAdmin,
    (req, res) => {

        const sql = `
            SELECT *
            FROM entry_requests
            WHERE status = 'pending'
            ORDER BY id DESC
        `;

        db.query(sql, (err, result) => {

            if (err) {

                console.log(
                    "GET REQUESTS ERROR:",
                    err
                );

                return res.status(500).json({
                    error:
                        "Failed to fetch requests",
                });
            }

            res.json(result);
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

        // GET REQUEST
        const getSql = `
            SELECT *
            FROM entry_requests
            WHERE id = ?
        `;

        db.query(getSql, [id], (err, rows) => {

            if (err || rows.length === 0) {

                return res.status(404).json({
                    error: "Request not found",
                });
            }

            const request = rows[0];

            // ADD VEHICLE
            const vehicleSql = `
                INSERT INTO vehicles
                (
                    plate_number,
                    driver_name,
                    company_name,
                    status
                )
                VALUES (?, ?, ?, 'approved')
            `;

            db.query(
                vehicleSql,
                [
                    request.plate_number,
                    request.driver_name,
                    request.company_name,
                ],
                (vehicleErr) => {

                    if (vehicleErr) {

                        console.log(vehicleErr);

                        return res.status(500).json({
                            error:
                                "Failed to add vehicle",
                        });
                    }

                    // UPDATE REQUEST
                    const updateSql = `
                        UPDATE entry_requests
                        SET
                            status = 'approved',
                            handled_by = ?
                        WHERE id = ?
                    `;

                    db.query(
                        updateSql,
                        [
                            req.user.id,
                            id,
                        ],
                        (updateErr) => {

                            if (updateErr) {

                                console.log(updateErr);

                                return res.status(500).json({
                                    error:
                                        "Failed to approve request",
                                });
                            }

                            res.json({
                                message:
                                    "Request approved",
                            });
                        }
                    );
                }
            );
        });
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
                handled_by = ?
            WHERE id = ?
        `;

        db.query(
            sql,
            [
                req.user.id,
                id,
            ],
            (err) => {

                if (err) {

                    console.log(err);

                    return res.status(500).json({
                        error:
                            "Failed to reject request",
                    });
                }

                res.json({
                    message:
                        "Request rejected",
                });
            }
        );
    }
);

module.exports = router;
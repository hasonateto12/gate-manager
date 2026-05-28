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

        // CREATE REQUEST
        const requestSql = `
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
            requestSql,
            [
                plate_number,
                driver_name,
                company_name,
                notes,
            ],
            (requestErr) => {

                if (requestErr) {

                    console.log(requestErr);

                    return res.status(500).json({
                        error:
                            "Failed to create request",
                    });
                }

                // CREATE TEMP VEHICLE
                const vehicleSql = `
                    INSERT INTO vehicles
                    (
                        plate_number,
                        driver_name,
                        company_name,
                        status
                    )
                    VALUES (?, ?, ?, 'pending')
                `;

                db.query(
                    vehicleSql,
                    [
                        plate_number,
                        driver_name,
                        company_name,
                    ],
                    (
                        vehicleErr,
                        vehicleResult
                    ) => {

                        if (vehicleErr) {

                            console.log(vehicleErr);

                            return res.status(500).json({
                                error:
                                    "Failed to create vehicle",
                            });
                        }

                        // CREATE ENTRY LOG
                        const logSql = `
                            INSERT INTO entry_logs
                            (
                                vehicle_id,
                                notes,
                                action_type,
                                result,
                                current_status,
                                guard_id,
                                entry_time
                            )
                            VALUES
                            (
                                ?,
                                ?,
                                'Entry',
                                'Pending',
                                'inside',
                                ?,
                                NOW()
                            )
                        `;

                        db.query(
                            logSql,
                            [
                                vehicleResult.insertId,
                                notes,
                                req.user.id,
                            ],
                            (logErr) => {

                                if (logErr) {

                                    console.log(logErr);

                                    return res.status(500).json({
                                        error:
                                            "Failed to create entry log",
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

        db.query(
            getSql,
            [id],
            (getErr, requestResult) => {

                if (getErr) {

                    console.log(getErr);

                    return res.status(500).json({
                        error:
                            "Failed to get request",
                    });
                }

                if (
                    requestResult.length === 0
                ) {

                    return res.status(404).json({
                        error:
                            "Request not found",
                    });
                }

                const request =
                    requestResult[0];

                // UPDATE REQUEST
                const updateRequestSql = `
                    UPDATE entry_requests
                    SET
                        status = 'approved',
                        handled_by = ?
                    WHERE id = ?
                `;

                db.query(
                    updateRequestSql,
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

                        // UPDATE VEHICLE
                        const updateVehicleSql = `
                            UPDATE vehicles
                            SET status = 'approved'
                            WHERE plate_number = ?
                        `;

                        db.query(
                            updateVehicleSql,
                            [
                                request.plate_number
                            ],
                            (
                                vehicleErr
                            ) => {

                                if (vehicleErr) {

                                    console.log(vehicleErr);

                                    return res.status(500).json({
                                        error:
                                            "Failed to update vehicle",
                                    });
                                }

                                // UPDATE ENTRY LOG
                                const updateLogSql = `
                                    UPDATE entry_logs
                                    SET result = 'Approved'
                                    WHERE vehicle_id IN
                                    (
                                        SELECT id
                                        FROM vehicles
                                        WHERE plate_number = ?
                                    )
                                `;

                                db.query(
                                    updateLogSql,
                                    [
                                        request.plate_number
                                    ],
                                    (
                                        logErr
                                    ) => {

                                        if (logErr) {

                                            console.log(logErr);

                                            return res.status(500).json({
                                                error:
                                                    "Failed to update log",
                                            });
                                        }

                                        res.json({
                                            message:
                                                "Vehicle approved successfully",
                                        });
                                    }
                                );
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

        // GET REQUEST
        const getSql = `
            SELECT *
            FROM entry_requests
            WHERE id = ?
        `;

        db.query(
            getSql,
            [id],
            (getErr, requestResult) => {

                if (getErr) {

                    console.log(getErr);

                    return res.status(500).json({
                        error:
                            "Failed to get request",
                    });
                }

                if (
                    requestResult.length === 0
                ) {

                    return res.status(404).json({
                        error:
                            "Request not found",
                    });
                }

                const request =
                    requestResult[0];

                // UPDATE REQUEST
                const updateRequestSql = `
                    UPDATE entry_requests
                    SET
                        status = 'rejected',
                        handled_by = ?
                    WHERE id = ?
                `;

                db.query(
                    updateRequestSql,
                    [
                        req.user.id,
                        id,
                    ],
                    (updateErr) => {

                        if (updateErr) {

                            console.log(updateErr);

                            return res.status(500).json({
                                error:
                                    "Failed to reject request",
                            });
                        }

                        // UPDATE VEHICLE
                        const updateVehicleSql = `
                            UPDATE vehicles
                            SET status = 'rejected'
                            WHERE plate_number = ?
                        `;

                        db.query(
                            updateVehicleSql,
                            [
                                request.plate_number
                            ],
                            (
                                vehicleErr
                            ) => {

                                if (vehicleErr) {

                                    console.log(vehicleErr);

                                    return res.status(500).json({
                                        error:
                                            "Failed to update vehicle",
                                    });
                                }

                                // UPDATE LOG
                                const updateLogSql = `
                                    UPDATE entry_logs
                                    SET result = 'Rejected'
                                    WHERE vehicle_id IN
                                    (
                                        SELECT id
                                        FROM vehicles
                                        WHERE plate_number = ?
                                    )
                                `;

                                db.query(
                                    updateLogSql,
                                    [
                                        request.plate_number
                                    ],
                                    (
                                        logErr
                                    ) => {

                                        if (logErr) {

                                            console.log(logErr);

                                            return res.status(500).json({
                                                error:
                                                    "Failed to update log",
                                            });
                                        }

                                        res.json({
                                            message:
                                                "Vehicle rejected successfully",
                                        });
                                    }
                                );
                            }
                        );
                    }
                );
            }
        );
    }
);

module.exports = router;
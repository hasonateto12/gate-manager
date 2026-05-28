const express = require("express");

const router = express.Router();

const db = require("../config/db");

const verifyToken =
    require("../middleware/authMiddleware");

const verifyAdmin =
    require("../middleware/roleMiddleware");

/* =========================
   GET ENTRY LOGS (ADMIN)
========================= */
router.get(
    "/",
    verifyToken,
    verifyAdmin,
    (req, res) => {

        const sql = `
            SELECT
                entry_logs.*,

                vehicles.plate_number,
                vehicles.driver_name,
                vehicles.company_name

            FROM entry_logs

                     LEFT JOIN vehicles
                               ON entry_logs.vehicle_id = vehicles.id

            ORDER BY entry_logs.id DESC
        `;

        db.query(sql, (err, result) => {

            if (err) {

                console.log(
                    "GET LOGS ERROR:",
                    err
                );

                return res.status(500).json({
                    error:
                        "Failed to fetch logs",
                });
            }

            res.json(result);
        });
    }
);

/* =========================
   GET INSIDE VEHICLES
========================= */
router.get(
    "/inside",
    verifyToken,
    (req, res) => {

        const sql = `
            SELECT
                entry_logs.id,
                entry_logs.entry_time,
                entry_logs.notes,
                entry_logs.current_status,

                vehicles.plate_number,
                vehicles.driver_name,
                vehicles.company_name

            FROM entry_logs

                     LEFT JOIN vehicles
                               ON entry_logs.vehicle_id = vehicles.id

            WHERE entry_logs.current_status = 'inside'

            ORDER BY entry_logs.entry_time DESC
        `;

        db.query(sql, (err, result) => {

            if (err) {

                console.log(
                    "GET INSIDE VEHICLES ERROR:",
                    err
                );

                return res.status(500).json({
                    error:
                        "Failed to fetch inside vehicles",
                });
            }

            res.json(result);
        });
    }
);

/* =========================
   CREATE ENTRY
========================= */
router.post(
    "/",
    verifyToken,
    (req, res) => {

        const {
            vehicle_id,
            notes,
        } = req.body;

        const sql = `
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
                    'Approved',
                    'inside',
                    ?,
                    NOW()
                )
        `;

        db.query(
            sql,
            [
                vehicle_id,
                notes,
                req.user.id,
            ],
            (err, result) => {

                if (err) {

                    console.log(
                        "CREATE ENTRY ERROR:",
                        err
                    );

                    return res.status(500).json({
                        error:
                            "Failed to create entry",
                    });
                }

                res.status(201).json({
                    message:
                        "Vehicle entered successfully",

                    log_id:
                    result.insertId,
                });
            }
        );
    }
);

/* =========================
   VEHICLE EXIT
========================= */
router.put(
    "/:id/exit",
    verifyToken,
    (req, res) => {

        const { id } = req.params;

        const sql = `
            UPDATE entry_logs

            SET
                current_status = 'outside',
                exit_time = NOW(),
                action_type = 'Exit'

            WHERE id = ?
        `;

        db.query(
            sql,
            [id],
            (err, result) => {

                if (err) {

                    console.log(
                        "EXIT ERROR:",
                        err
                    );

                    return res.status(500).json({
                        error:
                            "Failed to update exit",
                    });
                }

                res.json({
                    message:
                        "Vehicle exited successfully",
                });
            }
        );
    }
);

module.exports = router;
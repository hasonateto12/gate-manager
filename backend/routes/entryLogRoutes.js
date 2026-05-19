const express = require("express");
const router = express.Router();
const db = require("../config/db");
const verifyToken = require("../middleware/authMiddleware");
const verifyAdmin = require("../middleware/roleMiddleware");

const handleValidationErrors = require("../middleware/validationMiddleware");
const { getEntryLogsValidation } = require("../validators/entryLogValidators");

/* =========================
   GET LOGS
========================= */
router.get(
    "/",
    verifyToken,
    verifyAdmin,
    getEntryLogsValidation,
    handleValidationErrors,
    (req, res) => {
        const { vehicle_id, employee_id, result, from, to } = req.query;

        let sql = `
      SELECT el.*, v.plate_number, e.full_name
      FROM entry_logs el
      LEFT JOIN vehicles v ON el.vehicle_id = v.id
      LEFT JOIN employees e ON el.employee_id = e.id
      WHERE 1=1
    `;

        const params = [];

        if (vehicle_id) {
            sql += ` AND el.vehicle_id = ?`;
            params.push(vehicle_id);
        }

        if (employee_id) {
            sql += ` AND el.employee_id = ?`;
            params.push(employee_id);
        }

        if (result) {
            sql += ` AND el.result = ?`;
            params.push(result);
        }

        if (from) {
            sql += ` AND el.entry_time >= ?`;
            params.push(from);
        }

        if (to) {
            sql += ` AND el.entry_time <= ?`;
            params.push(to);
        }

        sql += ` ORDER BY el.id DESC`;

        db.query(sql, params, (err, resultData) => {
            if (err) {
                console.log("LOGS error:", err);

                return res.status(500).json({
                    error: "Failed to fetch logs",
                    details: err.message,
                });
            }

            res.json(resultData);
        });
    }
);


/* =========================
   VEHICLE EXIT
========================= */
router.put(
    "/:id/exit",
    verifyToken,
    verifyAdmin,
    (req, res) => {

        const { id } = req.params;

        const sql = `
            UPDATE entry_logs
            SET exit_time = NOW()
            WHERE id = ?
        `;

        db.query(sql, [id], (err, resultData) => {

            if (err) {

                console.log("EXIT error:", err);

                return res.status(500).json({
                    error: "Failed to update exit time",
                    details: err.message,
                });
            }

            if (resultData.affectedRows === 0) {

                return res.status(404).json({
                    error: "Log not found",
                });
            }

            res.json({
                message: "Vehicle exit updated successfully",
            });
        });
    }
);

module.exports = router;
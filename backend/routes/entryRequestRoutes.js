const express = require("express");
const router = express.Router();
const db = require("../config/db");
const verifyToken = require("../middleware/authMiddleware");
const verifyAdmin = require("../middleware/roleMiddleware");

const handleValidationErrors = require("../middleware/validationMiddleware");
const {
    entryRequestIdValidation,
    createEntryRequestValidation,
    updateEntryRequestStatusValidation,
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
        const { vehicle_id, notes } = req.body;

        if (!vehicle_id) {
            return res.status(400).json({
                error: "vehicle_id is required",
            });
        }

        const sql = `
        INSERT INTO entry_requests (vehicle_id, request_time, status, notes)
        VALUES (?, NOW(), 'pending', ?)
    `;

        db.query(sql, [vehicle_id, notes || null], (err, result) => {
            if (err) {
                console.log("CREATE REQUEST error:", err);

                if (err.code === "ER_NO_REFERENCED_ROW_2") {
                    return res.status(400).json({
                        error: "Invalid vehicle ID",
                        details: "The selected vehicle does not exist.",
                    });
                }

                return res.status(500).json({
                    error: "Failed to create request",
                    details: err.message,
                });
            }

            res.status(201).json({
                message: "Request created",
                request_id: result.insertId,
            });
        });
    }
);

/* =========================
   GET ALL (ADMIN)
========================= */
router.get("/", verifyToken, verifyAdmin, (req, res) => {
    const sql = `
        SELECT er.*, v.plate_number
        FROM entry_requests er
        LEFT JOIN vehicles v ON er.vehicle_id = v.id
        ORDER BY er.id DESC
    `;

    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({
                error: "Failed to fetch requests",
            });
        }

        res.json(result);
    });
});

/* =========================
   APPROVE / REJECT
========================= */
router.put(
    "/:id/status",
    verifyToken,
    verifyAdmin,
    entryRequestIdValidation,
    updateEntryRequestStatusValidation,
    handleValidationErrors,
    (req, res) => {
        const { id } = req.params;
        const { status, rejection_reason } = req.body;

        if (!["approved", "rejected"].includes(status)) {
            return res.status(400).json({
                error: "status must be approved or rejected",
            });
        }

        const sql = `
        UPDATE entry_requests
        SET status = ?, approved_by = ?, rejection_reason = ?
        WHERE id = ?
    `;

        db.query(
            sql,
            [
                status,
                req.user.id,
                rejection_reason || null,
                id,
            ],
            (err, result) => {
                if (err) {
                    console.log("UPDATE STATUS error:", err);
                    return res.status(500).json({
                        error: "Failed to update status",
                    });
                }

                if (result.affectedRows === 0) {
                    return res.status(404).json({
                        error: "Request not found",
                    });
                }

                res.json({
                    message: `Request ${status}`,
                });
            }
        );
    }
);

module.exports = router;
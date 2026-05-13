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

        // Step 1: update request
        const updateSql = `
      UPDATE entry_requests
      SET status = ?, approved_by = ?, rejection_reason = ?
      WHERE id = ?
    `;

        db.query(
            updateSql,
            [status, req.user.id, rejection_reason || null, id],
            (updateErr, updateResult) => {
                if (updateErr) {
                    console.log("UPDATE STATUS error:", updateErr);

                    return res.status(500).json({
                        error: "Failed to update request status",
                    });
                }

                if (updateResult.affectedRows === 0) {
                    return res.status(404).json({
                        error: "Request not found",
                    });
                }

                // Step 2: get request + vehicle employee
                const fetchSql = `
          SELECT 
            er.vehicle_id,
            er.notes,
            v.employee_id
          FROM entry_requests er
          LEFT JOIN vehicles v ON er.vehicle_id = v.id
          WHERE er.id = ?
        `;

                db.query(fetchSql, [id], (fetchErr, requestData) => {
                    if (fetchErr) {
                        console.log("FETCH REQUEST error:", fetchErr);

                        return res.status(500).json({
                            error: "Failed to fetch request data",
                        });
                    }

                    if (requestData.length === 0) {
                        return res.status(404).json({
                            error: "Request data not found",
                        });
                    }

                    const request = requestData[0];

                    // Step 3: insert log
                    const logSql = `
            INSERT INTO entry_logs (
              vehicle_id,
              employee_id,
              entry_time,
              result,
              handled_by,
              notes
            )
            VALUES (?, ?, NOW(), ?, ?, ?)
          `;

                    db.query(
                        logSql,
                        [
                            request.vehicle_id,
                            request.employee_id || null,
                            status,
                            req.user.id,
                            request.notes || null,
                        ],
                        (logErr) => {
                            if (logErr) {
                                console.log("LOG INSERT error:", logErr);

                                return res.status(500).json({
                                    error: "Request updated but failed to create log",
                                });
                            }

                            res.json({
                                message: `Request ${status} and log created successfully`,
                            });
                        }
                    );
                });
            }
        );
    }
);

module.exports = router;
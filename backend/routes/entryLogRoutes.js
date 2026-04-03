const express = require("express");
const router = express.Router();
const db = require("../config/db");
const verifyToken = require("../middleware/authMiddleware");
const verifyAdmin = require("../middleware/roleMiddleware");

/* =========================
   GET LOGS
========================= */
router.get("/", verifyToken, verifyAdmin, (req, res) => {
    const sql = `
        SELECT el.*, v.plate_number, e.full_name
        FROM entry_logs el
        LEFT JOIN vehicles v ON el.vehicle_id = v.id
        LEFT JOIN employees e ON el.employee_id = e.id
        ORDER BY el.id DESC
    `;

    db.query(sql, (err, result) => {
        if (err) {
            console.log("LOGS error:", err);
            return res.status(500).json({
                error: "Failed to fetch logs"
            });
        }

        res.json(result);
    });
});

module.exports = router;
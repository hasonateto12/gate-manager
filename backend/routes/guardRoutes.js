const express = require("express");
const router = express.Router();

const db = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

// Guard creates entry request
router.post("/entry-request", authMiddleware, allowRoles("guard"), async (req, res) => {
    try {
        const { vehicle_id, employee_id, reason } = req.body;

        if (!vehicle_id || !employee_id) {
            return res.status(400).json({
                message: "vehicle_id and employee_id are required",
            });
        }

        const sql = `
      INSERT INTO entry_requests 
      (vehicle_id, employee_id, reason, status, created_by)
      VALUES (?, ?, ?, 'Pending', ?)
    `;

        const [result] = await db.query(sql, [
            vehicle_id,
            employee_id,
            reason || null,
            req.user.id,
        ]);

        res.status(201).json({
            message: "Entry request created successfully",
            requestId: result.insertId,
        });
    } catch (error) {
        console.error("Guard entry request error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
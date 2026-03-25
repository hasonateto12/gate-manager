const express = require("express");
const router = express.Router();
const db = require("../config/db");
const verifyToken = require("../middleware/authMiddleware");
const verifyAdmin = require("../middleware/roleMiddleware");

/* =========================
   VEHICLES API
========================= */

/* Get all vehicles - any logged-in user */
router.get("/", verifyToken, (req, res) => {
    const sql = `
        SELECT vehicles.*, employees.full_name AS employee_name
        FROM vehicles
        LEFT JOIN employees ON vehicles.employee_id = employees.id
        ORDER BY vehicles.id DESC
    `;

    db.query(sql, (err, result) => {
        if (err) {
            console.log("GET /api/vehicles error:", err);
            return res.status(500).json({
                error: "Failed to fetch vehicles",
                details: err.message
            });
        }

        res.json(result);
    });
});

/* Add new vehicle - admin only */
router.post("/", verifyToken, verifyAdmin, (req, res) => {
    const { plate_number, vehicle_type, color, employee_id, status } = req.body;

    if (!plate_number) {
        return res.status(400).json({ error: "Plate number is required" });
    }

    const sql = `
        INSERT INTO vehicles (plate_number, vehicle_type, color, employee_id, status)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            plate_number,
            vehicle_type || null,
            color || null,
            employee_id || null,
            status || "pending"
        ],
        (err, result) => {
            if (err) {
                console.log("POST /api/vehicles error:", err);
                return res.status(500).json({
                    error: "Failed to add vehicle",
                    details: err.message
                });
            }

            res.json({
                message: "Vehicle added successfully",
                id: result.insertId
            });
        }
    );
});

/* Update vehicle - admin only */
router.put("/:id", verifyToken, verifyAdmin, (req, res) => {
    const { id } = req.params;
    const { plate_number, vehicle_type, color, employee_id, status } = req.body;

    if (!plate_number) {
        return res.status(400).json({ error: "Plate number is required" });
    }

    const sql = `
        UPDATE vehicles
        SET plate_number = ?, vehicle_type = ?, color = ?, employee_id = ?, status = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [
            plate_number,
            vehicle_type || null,
            color || null,
            employee_id || null,
            status || "pending",
            id
        ],
        (err, result) => {
            if (err) {
                console.log(`PUT /api/vehicles/${id} error:`, err);
                return res.status(500).json({
                    error: "Failed to update vehicle",
                    details: err.message
                });
            }

            res.json({ message: "Vehicle updated successfully" });
        }
    );
});

/* Delete vehicle - admin only */
router.delete("/:id", verifyToken, verifyAdmin, (req, res) => {
    const { id } = req.params;

    const sql = `DELETE FROM vehicles WHERE id = ?`;

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.log(`DELETE /api/vehicles/${id} error:`, err);
            return res.status(500).json({
                error: "Failed to delete vehicle",
                details: err.message
            });
        }

        res.json({ message: "Vehicle deleted successfully" });
    });
});

module.exports = router;
const express = require("express");
const router = express.Router();
const db = require("../config/db");

/* =========================
   VEHICLES API
========================= */

/* Get all vehicles */
router.get("/", (req, res) => {
    const sql = `
        SELECT vehicles.*, employees.full_name AS employee_name
        FROM vehicles
        LEFT JOIN employees ON vehicles.employee_id = employees.id
        ORDER BY vehicles.id DESC
    `;

    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Failed to fetch vehicles" });
        }

        res.json(result);
    });
});

/* Add new vehicle */
router.post("/", (req, res) => {
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
                console.log(err);
                return res.status(500).json({ error: "Failed to add vehicle" });
            }

            res.json({
                message: "Vehicle added successfully",
                id: result.insertId
            });
        }
    );
});

/* Update vehicle */
router.put("/:id", (req, res) => {
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
                console.log(err);
                return res.status(500).json({ error: "Failed to update vehicle" });
            }

            res.json({ message: "Vehicle updated successfully" });
        }
    );
});

/* Delete vehicle */
router.delete("/:id", (req, res) => {
    const { id } = req.params;

    const sql = `DELETE FROM vehicles WHERE id = ?`;

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Failed to delete vehicle" });
        }

        res.json({ message: "Vehicle deleted successfully" });
    });
});

module.exports = router;
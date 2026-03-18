const express = require("express");
const router = express.Router();
const db = require("../config/db");

/* =========================
   EMPLOYEES API
========================= */

/* Get all employees */
router.get("/", (req, res) => {
    const sql = `SELECT * FROM employees ORDER BY id DESC`;

    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Failed to fetch employees" });
        }

        res.json(result);
    });
});

/* Add new employee */
router.post("/", (req, res) => {
    const { full_name, employee_number, department, phone, is_active } = req.body;

    if (!full_name) {
        return res.status(400).json({ error: "Full name is required" });
    }

    const sql = `
        INSERT INTO employees (full_name, employee_number, department, phone, is_active)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            full_name,
            employee_number || null,
            department || null,
            phone || null,
            is_active !== undefined ? is_active : true
        ],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: "Failed to add employee" });
            }

            res.json({
                message: "Employee added successfully",
                id: result.insertId
            });
        }
    );
});

/* Update employee */
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { full_name, employee_number, department, phone, is_active } = req.body;

    if (!full_name) {
        return res.status(400).json({ error: "Full name is required" });
    }

    const sql = `
        UPDATE employees
        SET full_name = ?, employee_number = ?, department = ?, phone = ?, is_active = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [
            full_name,
            employee_number || null,
            department || null,
            phone || null,
            is_active !== undefined ? is_active : true,
            id
        ],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: "Failed to update employee" });
            }

            res.json({ message: "Employee updated successfully" });
        }
    );
});

/* Delete employee */
router.delete("/:id", (req, res) => {
    const { id } = req.params;

    const sql = `DELETE FROM employees WHERE id = ?`;

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Failed to delete employee" });
        }

        res.json({ message: "Employee deleted successfully" });
    });
});

module.exports = router;
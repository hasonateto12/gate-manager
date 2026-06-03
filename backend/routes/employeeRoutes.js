const express = require("express");
const router = express.Router();

const db = require("../config/db");

const verifyToken = require("../middleware/authMiddleware");
const verifyAdmin = require("../middleware/roleMiddleware");

/* =========================
   GET ALL EMPLOYEES
========================= */
router.get("/", verifyToken, (req, res) => {
    const sql = `
        SELECT
            id,
            full_name,
            department,
            phone,
            created_at
        FROM employees
        ORDER BY id DESC
    `;

    db.query(sql, (err, result) => {
        if (err) {
            console.log("GET EMPLOYEES ERROR:", err);

            return res.status(500).json({
                error: "Failed to fetch employees",
                details: err.message,
            });
        }

        res.json(result);
    });
});

/* =========================
   ADD EMPLOYEE
========================= */
router.post("/", verifyToken, verifyAdmin, (req, res) => {
    const {
        full_name,
        department,
        phone,
    } = req.body;

    const sql = `
        INSERT INTO employees
        (
            full_name,
            department,
            phone
        )
        VALUES (?, ?, ?)
    `;

    db.query(
        sql,
        [
            full_name,
            department || null,
            phone || null,
        ],
        (err, result) => {
            if (err) {
                console.log("ADD EMPLOYEE ERROR:", err);

                return res.status(500).json({
                    error: "Failed to add employee",
                    details: err.message,
                });
            }

            res.status(201).json({
                message: "Employee added successfully",
                id: result.insertId,
            });
        }
    );
});

/* =========================
   UPDATE EMPLOYEE
========================= */
router.put("/:id", verifyToken, verifyAdmin, (req, res) => {
    const { id } = req.params;

    const {
        full_name,
        department,
        phone,
    } = req.body;

    const sql = `
        UPDATE employees
        SET
            full_name = ?,
            department = ?,
            phone = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [
            full_name,
            department || null,
            phone || null,
            id,
        ],
        (err, result) => {
            if (err) {
                console.log("UPDATE EMPLOYEE ERROR:", err);

                return res.status(500).json({
                    error: "Failed to update employee",
                    details: err.message,
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    error: "Employee not found",
                });
            }

            res.json({
                message: "Employee updated successfully",
            });
        }
    );
});

/* =========================
   DELETE EMPLOYEE
========================= */
router.delete("/:id", verifyToken, verifyAdmin, (req, res) => {
    const { id } = req.params;

    const sql = `
        DELETE FROM employees
        WHERE id = ?
    `;

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.log("DELETE EMPLOYEE ERROR:", err);

            if (err.code === "ER_ROW_IS_REFERENCED_2") {
                return res.status(409).json({
                    error: "Cannot delete employee",
                    details:
                        "This employee is linked to existing vehicles. Delete or reassign the related vehicles first.",
                });
            }

            return res.status(500).json({
                error: "Failed to delete employee",
                details: err.message,
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: "Employee not found",
            });
        }

        res.json({
            message: "Employee deleted successfully",
        });
    });
});

module.exports = router;
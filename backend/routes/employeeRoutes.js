const express = require("express");
const router = express.Router();
const db = require("../config/db");
const verifyToken = require("../middleware/authMiddleware");
const verifyAdmin = require("../middleware/roleMiddleware");

const handleValidationErrors = require("../middleware/validationMiddleware");
const {
    employeeIdValidation,
    createEmployeeValidation,
    updateEmployeeValidation,
} = require("../validators/employeeValidators");

/* =========================
   EMPLOYEES API
========================= */

/* Get all employees - any logged-in user */
router.get("/", verifyToken, (req, res) => {
    const sql = `SELECT * FROM employees ORDER BY id DESC`;

    db.query(sql, (err, result) => {
        if (err) {
            console.log("GET /api/employees error:", err);
            return res.status(500).json({
                error: "Failed to fetch employees",
                details: err.message,
            });
        }

        res.json(result);
    });
});

/* Add new employee - admin only */
router.post(
    "/",
    verifyToken,
    verifyAdmin,
    createEmployeeValidation,
    handleValidationErrors,
    (req, res) => {
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
                is_active !== undefined ? is_active : true,
            ],
            (err, result) => {
                if (err) {
                    console.log("POST /api/employees error:", err);
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
    }
);

/* Update employee - admin only */
router.put(
    "/:id",
    verifyToken,
    verifyAdmin,
    employeeIdValidation,
    updateEmployeeValidation,
    handleValidationErrors,
    (req, res) => {
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
                id,
            ],
            (err, result) => {
                if (err) {
                    console.log(`PUT /api/employees/${id} error:`, err);
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

                res.json({ message: "Employee updated successfully" });
            }
        );
    }
);

/* Delete employee - admin only */
router.delete(
    "/:id",
    verifyToken,
    verifyAdmin,
    employeeIdValidation,
    handleValidationErrors,
    (req, res) => {
        const { id } = req.params;

        const sql = `DELETE FROM employees WHERE id = ?`;

        db.query(sql, [id], (err, result) => {
            if (err) {
                console.log(`DELETE /api/employees/${id} error:`, err);

                if (err.code === "ER_ROW_IS_REFERENCED_2") {
                    return res.status(409).json({
                        error: "Cannot delete employee",
                        details: "This employee is linked to existing vehicles. Delete or reassign the related vehicles first.",
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

            res.json({ message: "Employee deleted successfully" });
        });
    }
);
module.exports = router;
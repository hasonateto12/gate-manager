const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

/* =========================
   Database Connection
========================= */

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "gate_manager"
});

db.connect((err) => {
    if (err) {
        console.log("Database connection failed:", err);
    } else {
        console.log("Connected to MySQL");
    }
});

/* =========================
   Test Route
========================= */

app.get("/", (req, res) => {
    res.send("Gate Manager API Running");
});

/* =========================
   VEHICLES API
========================= */

/* Get all vehicles */
app.get("/api/vehicles", (req, res) => {
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
app.post("/api/vehicles", (req, res) => {
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
app.put("/api/vehicles/:id", (req, res) => {
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
app.delete("/api/vehicles/:id", (req, res) => {
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

/* =========================
   EMPLOYEES API
========================= */

/* Get all employees */
app.get("/api/employees", (req, res) => {
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
app.post("/api/employees", (req, res) => {
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
app.put("/api/employees/:id", (req, res) => {
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
app.delete("/api/employees/:id", (req, res) => {
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

/* =========================
   Start Server
========================= */

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

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

/* Test route */
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

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

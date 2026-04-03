const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Database connection
require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const entryRequestRoutes = require("./routes/entryRequestRoutes");
const entryLogRoutes = require("./routes/entryLogRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

// Middlewares
app.use(cors());
app.use(express.json());

/* =========================
   Test Route
========================= */
app.get("/", (req, res) => {
    res.send("Gate Manager API Running");
});

/* =========================
   API Routes
========================= */
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/entry-requests", entryRequestRoutes);
app.use("/api/entry-logs", entryLogRoutes);
app.use("/api/dashboard", dashboardRoutes);

/* =========================
   Start Server
========================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
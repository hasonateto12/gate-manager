const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Import database connection
require("./config/db");

// Import routes
const employeeRoutes = require("./routes/employeeRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");

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
app.use("/api/employees", employeeRoutes);
app.use("/api/vehicles", vehicleRoutes);

/* =========================
   Start Server
========================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
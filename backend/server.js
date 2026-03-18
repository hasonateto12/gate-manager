const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Database connection
require("./config/db");

// Routes
const employeeRoutes = require("./routes/employeeRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const authRoutes = require("./routes/authRoutes");

// Middlewares
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Gate Manager API Running");
});

app.use("/api/employees", employeeRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
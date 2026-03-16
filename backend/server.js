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

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
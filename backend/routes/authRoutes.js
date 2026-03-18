const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

/* =========================
   REGISTER
========================= */
router.post("/register", async (req, res) => {
    const { full_name, username, email, password, role } = req.body;

    if (!full_name || !username || !email || !password) {
        return res.status(400).json({
            error: "full_name, username, email and password are required"
        });
    }

    // check if email or username exists
    const checkSql = `SELECT * FROM users WHERE email = ? OR username = ?`;

    db.query(checkSql, [email, username], async (err, result) => {
        if (err) {
            console.log("REGISTER error:", err);
            return res.status(500).json({
                error: "Database error",
                details: err.message
            });
        }

        if (result.length > 0) {
            return res.status(409).json({
                error: "Email or username already exists"
            });
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10);

            const insertSql = `
                INSERT INTO users (full_name, username, email, password_hash, role)
                VALUES (?, ?, ?, ?, ?)
            `;

            db.query(
                insertSql,
                [
                    full_name,
                    username,
                    email,
                    hashedPassword,
                    role || "user"
                ],
                (insertErr, insertResult) => {
                    if (insertErr) {
                        console.log("INSERT USER error:", insertErr);
                        return res.status(500).json({
                            error: "Failed to register user",
                            details: insertErr.message
                        });
                    }

                    res.status(201).json({
                        message: "User registered successfully",
                        user: {
                            id: insertResult.insertId,
                            full_name,
                            username,
                            email,
                            role: role || "user"
                        }
                    });
                }
            );
        } catch (e) {
            return res.status(500).json({
                error: "Password hashing failed"
            });
        }
    });
});

/* =========================
   LOGIN
========================= */
router.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            error: "email and password are required"
        });
    }

    const sql = `SELECT * FROM users WHERE email = ?`;

    db.query(sql, [email], async (err, result) => {
        if (err) {
            console.log("LOGIN error:", err);
            return res.status(500).json({
                error: "Database error",
                details: err.message
            });
        }

        if (result.length === 0) {
            return res.status(401).json({
                error: "Invalid email or password"
            });
        }

        const user = result[0];

        try {
            const isMatch = await bcrypt.compare(password, user.password_hash);

            if (!isMatch) {
                return res.status(401).json({
                    error: "Invalid email or password"
                });
            }

            const token = jwt.sign(
                {
                    id: user.id,
                    email: user.email,
                    role: user.role
                },
                process.env.JWT_SECRET,
                { expiresIn: "1d" }
            );

            res.json({
                message: "Login successful",
                token,
                user: {
                    id: user.id,
                    full_name: user.full_name,
                    username: user.username,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (e) {
            return res.status(500).json({
                error: "Login failed"
            });
        }
    });
});

/* =========================
   PROTECTED ROUTE
========================= */
router.get("/profile", verifyToken, (req, res) => {
    const sql = `
        SELECT id, full_name, username, email, role, created_at
        FROM users
        WHERE id = ?
    `;

    db.query(sql, [req.user.id], (err, result) => {
        if (err) {
            console.log("PROFILE error:", err);
            return res.status(500).json({
                error: "Database error",
                details: err.message
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                error: "User not found"
            });
        }

        res.json({
            message: "Protected data",
            user: result[0]
        });
    });
});

module.exports = router;
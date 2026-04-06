const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const verifyToken = require("../middleware/authMiddleware");

// ✅ NEW
const handleValidationErrors = require("../middleware/validationMiddleware");
const {
    registerValidation,
    loginValidation,
} = require("../validators/authValidators");

const router = express.Router();

/* =========================
   REGISTER
========================= */
router.post(
    "/register",
    registerValidation,          // ✅ NEW
    handleValidationErrors,      // ✅ NEW
    async (req, res) => {
        const { full_name, username, email, password, role } = req.body;

        // ❗ אפשר להשאיר את זה (לא מפריע)
        if (!full_name || !username || !email || !password) {
            return res.status(400).json({
                error: "full_name, username, email and password are required",
            });
        }

        const checkSql = `SELECT * FROM users WHERE email = ? OR username = ?`;

        db.query(checkSql, [email, username], async (err, result) => {
            if (err) {
                console.log("REGISTER check error:", err);
                return res.status(500).json({
                    error: "Database error",
                    details: err.message,
                });
            }

            if (result.length > 0) {
                return res.status(409).json({
                    error: "Email or username already exists",
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
                    [full_name, username, email, hashedPassword, role || "user"],
                    (insertErr, insertResult) => {
                        if (insertErr) {
                            console.log("REGISTER insert error:", insertErr);
                            return res.status(500).json({
                                error: "Failed to register user",
                                details: insertErr.message,
                            });
                        }

                        return res.status(201).json({
                            message: "User registered successfully",
                            user: {
                                id: insertResult.insertId,
                                full_name,
                                username,
                                email,
                                role: role || "user",
                            },
                        });
                    }
                );
            } catch (hashError) {
                console.log("HASH error:", hashError);
                return res.status(500).json({
                    error: "Password hashing failed",
                    details: hashError.message,
                });
            }
        });
    }
);

/* =========================
   LOGIN
========================= */
router.post(
    "/login",
    loginValidation,            // ✅ NEW
    handleValidationErrors,     // ✅ NEW
    (req, res) => {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: "email and password are required",
            });
        }

        const sql = `SELECT * FROM users WHERE email = ?`;

        db.query(sql, [email], async (err, result) => {
            if (err) {
                console.log("LOGIN db error:", err);
                return res.status(500).json({
                    error: "Database error",
                    details: err.message,
                });
            }

            if (result.length === 0) {
                return res.status(401).json({
                    error: "Invalid email or password",
                });
            }

            const user = result[0];

            try {
                if (!user.password_hash) {
                    return res.status(500).json({
                        error: "password_hash field is missing from database result",
                    });
                }

                const isMatch = await bcrypt.compare(password, user.password_hash);

                if (!isMatch) {
                    return res.status(401).json({
                        error: "Invalid email or password",
                    });
                }

                const token = jwt.sign(
                    {
                        id: user.id,
                        email: user.email,
                        role: user.role,
                    },
                    process.env.JWT_SECRET,
                    { expiresIn: "1d" }
                );

                return res.status(200).json({
                    message: "Login successful",
                    token,
                    user: {
                        id: user.id,
                        full_name: user.full_name,
                        username: user.username,
                        email: user.email,
                        role: user.role,
                    },
                });
            } catch (compareError) {
                console.log("BCRYPT COMPARE ERROR:", compareError);
                return res.status(500).json({
                    error: "Login failed",
                    details: compareError.message,
                });
            }
        });
    }
);

/* =========================
   PROFILE
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
                details: err.message,
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                error: "User not found",
            });
        }

        return res.status(200).json({
            message: "Protected data",
            user: result[0],
        });
    });
});

module.exports = router;
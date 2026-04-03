const express = require("express");
const router = express.Router();
const db = require("../config/db");
const verifyToken = require("../middleware/authMiddleware");
const verifyAdmin = require("../middleware/roleMiddleware");

/* =========================
   DASHBOARD STATS
========================= */
router.get("/stats", verifyToken, verifyAdmin, (req, res) => {
    const sql = `
        SELECT
            SUM(status = 'pending') AS pending,
            SUM(status = 'approved') AS approved,
            SUM(status = 'rejected') AS rejected,
            COUNT(*) AS total
        FROM entry_requests
    `;

    db.query(sql, (err, result) => {
        if (err) {
            console.log("DASHBOARD error:", err);
            return res.status(500).json({
                error: "Failed to fetch stats",
                details: err.message
            });
        }

        res.json(result[0]);
    });
});

/* =========================
   FILTER REQUESTS
========================= */
router.get("/requests", verifyToken, verifyAdmin, (req, res) => {
    const { status, from_date, to_date, vehicle_id } = req.query;

    let sql = `
        SELECT er.*, v.plate_number
        FROM entry_requests er
        LEFT JOIN vehicles v ON er.vehicle_id = v.id
        WHERE 1=1
    `;

    const params = [];

    if (status) {
        sql += ` AND er.status = ?`;
        params.push(status);
    }

    if (vehicle_id) {
        sql += ` AND er.vehicle_id = ?`;
        params.push(vehicle_id);
    }

    if (from_date) {
        sql += ` AND DATE(er.request_time) >= ?`;
        params.push(from_date);
    }

    if (to_date) {
        sql += ` AND DATE(er.request_time) <= ?`;
        params.push(to_date);
    }

    sql += ` ORDER BY er.id DESC`;

    db.query(sql, params, (err, result) => {
        if (err) {
            console.log("FILTER error:", err);
            return res.status(500).json({
                error: "Failed to filter requests",
                details: err.message
            });
        }

        res.json(result);
    });
});

/* =========================
   SEARCH REQUESTS
========================= */
router.get("/search", verifyToken, verifyAdmin, (req, res) => {
    const { q, status, from_date, to_date } = req.query;

    let sql = `
        SELECT er.*, v.plate_number
        FROM entry_requests er
        LEFT JOIN vehicles v ON er.vehicle_id = v.id
        WHERE 1=1
    `;

    const params = [];

    if (q) {
        sql += `
            AND (
                v.plate_number LIKE ?
                OR er.notes LIKE ?
                OR er.status LIKE ?
                OR CAST(er.id AS CHAR) LIKE ?
            )
        `;
        const searchValue = `%${q}%`;
        params.push(searchValue, searchValue, searchValue, searchValue);
    }

    if (status) {
        sql += ` AND er.status = ?`;
        params.push(status);
    }

    if (from_date) {
        sql += ` AND DATE(er.request_time) >= ?`;
        params.push(from_date);
    }

    if (to_date) {
        sql += ` AND DATE(er.request_time) <= ?`;
        params.push(to_date);
    }

    sql += ` ORDER BY er.id DESC`;

    db.query(sql, params, (err, result) => {
        if (err) {
            console.log("SEARCH error:", err);
            return res.status(500).json({
                error: "Failed to search requests",
                details: err.message
            });
        }

        res.json(result);
    });
});

module.exports = router;
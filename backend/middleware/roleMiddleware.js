const verifyAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            error: "Unauthorized. User data not found"
        });
    }

    if (req.user.role !== "admin") {
        return res.status(403).json({
            error: "Access denied. Admins only"
        });
    }

    next();
};

module.exports = verifyAdmin;
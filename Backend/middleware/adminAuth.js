// Backend/middleware/adminAuth.js
const jwt = require("jsonwebtoken");

/**
 * Middleware: Verifies JWT and ensures the user has admin or super_admin role.
 * Attach to any admin-only route.
 */
const adminAuth = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!["admin", "super_admin"].includes(decoded.role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden. Admin privileges required.",
      });
    }

    req.admin = decoded; // { _id, username, role }
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please log in again.",
      });
    }
    return res.status(401).json({
      success: false,
      message: "Invalid token.",
    });
  }
};

module.exports = adminAuth;
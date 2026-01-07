const jwt = require("jsonwebtoken");
const { User } = require("../models/User");

const superAdminMiddleware = async (req, res, next) => {
  try {
    // Get token from headers
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) return res.status(401).json({ message: "Invalid token." });

    // Find user
    const user = await User.findById(decoded._id);
    if (!user) return res.status(401).json({ message: "User not found." });

    // Check role
    if (user.role !== "super_admin") {
      return res.status(403).json({ message: "Access denied. Not a super admin." });
    }

    // Attach user to request for future use
    req.user = user;
    next();

  } catch (err) {
    console.error("SuperAdmin Middleware Error:", err);
    res.status(400).json({ message: "Invalid token." });
  }
};

module.exports = superAdminMiddleware;

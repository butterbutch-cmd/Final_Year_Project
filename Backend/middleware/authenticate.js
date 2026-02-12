// //file: Final_Year_Project/Backend/middleware/authenticate.js
// const jwt = require("jsonwebtoken");
// const { User } = require("../models/User");

// module.exports = async function authenticate(req, res, next) {
//   try {
//     const token = req.header("Authorization")?.split(" ")[1];
//     if (!token) return res.status(401).json({ message: "No token, authorization denied" });

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // Fetch fresh user from DB
//     const user = await User.findById(decoded._id).select("-password");
//     if (!user) return res.status(401).json({ message: "User not found" });

//     if (user.isDisabled) return res.status(403).json({ message: "Account is disabled" });

//     req.user = user;
//     next();
//   } catch (err) {
//     console.error("Auth error:", err);
//     res.status(401).json({ message: "Token is not valid" });
//   }
// };


// file: Final_Year_Project/Backend/middleware/authenticate.js

const jwt = require("jsonwebtoken");
const { User } = require("../models/User");

module.exports = async function authenticate(req, res, next) {
  try {
    // Get token from Authorization header
    const authHeader = req.header("Authorization");
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    if (!token) {
      return res.status(401).json({
        message: "No token provided. Authorization denied.",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch fresh user from DB
    const user = await User.findById(decoded._id).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User not found.",
      });
    }

    if (user.isDisabled) {
      return res.status(403).json({
        message: "Account is disabled.",
      });
    }

    // Attach user to request
    req.user = user;

    next();
  } catch (err) {
    console.error("Auth error:", err);

    // Handle expired token specifically
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token expired. Please login again.",
      });
    }

    // Handle invalid token
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Invalid token.",
      });
    }

    // Generic fallback
    return res.status(500).json({
      message: "Authentication failed.",
    });
  }
};

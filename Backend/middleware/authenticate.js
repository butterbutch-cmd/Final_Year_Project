//file: Final_Year_Project/Backend/middleware/authenticate.js
const jwt = require("jsonwebtoken");
const { User } = require("../models/User");

module.exports = async function authenticate(req, res, next) {
  try {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token, authorization denied" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch fresh user from DB
    const user = await User.findById(decoded._id).select("-password");
    if (!user) return res.status(401).json({ message: "User not found" });

    if (user.isDisabled) return res.status(403).json({ message: "Account is disabled" });

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth error:", err);
    res.status(401).json({ message: "Token is not valid" });
  }
};

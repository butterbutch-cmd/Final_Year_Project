const express = require("express");
const jwt = require("jsonwebtoken");
const { User } = require("../models/User");

const router = express.Router();

/* ==================== AUTH MIDDLEWARE ==================== */
const auth = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) return res.status(401).json({ message: "No token provided" });

    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded._id;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

/* ==================== GET LOGGED-IN USER ORDERS ==================== */
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate("orders.items.product", "name price image1")
      .select("orders");

    if (!user) return res.status(404).json({ message: "User not found" });

    const orders = (user.orders || []).sort(
      (a, b) => new Date(b.purchasedAt) - new Date(a.purchasedAt)
    );

    res.status(200).json(orders);
  } catch (error) {
    console.error("GET /api/user/orders error:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

module.exports = router;

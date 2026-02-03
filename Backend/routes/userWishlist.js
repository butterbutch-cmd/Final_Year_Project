// routes/userWishlist.js
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { User } = require("../models/User");
const auth = require("../middleware/auth"); // middleware that sets req.user

/**
 * GET /api/user/wishlist
 * Fetch current user's wishlist
 */
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("wishlist");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ wishlist: user.wishlist });
  } catch (err) {
    console.error("Error fetching wishlist:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * PATCH /api/user/wishlist/:id
 * Add or remove product from wishlist
 */
router.patch("/:id", auth, async (req, res) => {
  const userId = req.user._id;
  const productId = req.params.id;

  console.log("PATCH /wishlist called with productId:", productId);

  if (!productId) return res.status(400).json({ message: "Product ID missing!" });

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    console.log("User wishlist before toggle:", user.wishlist);

    // Convert string to ObjectId safely
    let productObjectId;
    try {
      productObjectId = new mongoose.Types.ObjectId(productId); // <-- use 'new'!
    } catch (err) {
      console.error("Invalid productId:", productId);
      return res.status(400).json({ message: "Invalid product ID" });
    }

    // Ensure all wishlist items are compared as strings
    const wishlistIndex = user.wishlist?.findIndex(
      (id) => id.toString() === productObjectId.toString()
    );

    if (wishlistIndex === -1 || wishlistIndex === undefined) {
      // Add to wishlist
      user.wishlist = [...(user.wishlist || []), productObjectId];
    } else {
      // Remove from wishlist
      user.wishlist.splice(wishlistIndex, 1);
    }

    await user.save();

    console.log("User wishlist after toggle:", user.wishlist);

    const populatedUser = await User.findById(userId).populate("wishlist");
    res.json({ wishlist: populatedUser.wishlist });
  } catch (err) {
    console.error("Error toggling wishlist:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;

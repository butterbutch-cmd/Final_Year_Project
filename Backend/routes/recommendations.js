///file location: Final_Year_Project/Backend/routes/recommendations.js

//importing the required modules and models
const express = require("express");
const {User} = require("../models/User")
const Product = require("../models/Product")

const router= express.Router();

///GET RECOMMENDATIONS FOR A USER
///based on their interactions (orders, wishlist, cart)
router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate("wishlist")
      .populate("cart.product")
      .populate("orders.items.product");

    if (!user) return res.status(404).json({ message: "User not found" });

    const categories = new Set();
    const careLevels = new Set();
    const sunlight = new Set();
    const water = new Set();

    // ================= ORDERS =================
    user.orders.forEach(order => {
      order.items.forEach(item => {
        const p = item.product;

        if (!p) return;

        categories.add(p.category);
        careLevels.add(p.care?.level);
        sunlight.add(p.care?.sunlight);
        water.add(p.care?.water);
      });
    });

    // ================= WISHLIST =================
    user.wishlist.forEach(p => {
      categories.add(p.category);
      careLevels.add(p.care?.level);
      sunlight.add(p.care?.sunlight);
      water.add(p.care?.water);
    });

    // ================= CART =================
    user.cart.forEach(c => {
      const p = c.product;

      categories.add(p.category);
      careLevels.add(p.care?.level);
      sunlight.add(p.care?.sunlight);
      water.add(p.care?.water);
    });

    // ================= FIND MATCH =================
    // get all candidate products
    const products = await Product.find({
    $or: [
        { category: { $in: [...categories] } },
        { "care.level": { $in: [...careLevels] } },
        { "care.sunlight": { $in: [...sunlight] } },
        { "care.water": { $in: [...water] } }
    ]
    });

    // calculate score
    const scored = products.map(p => {
    let score = 0;

    if (categories.has(p.category)) score++;
    if (careLevels.has(p.care?.level)) score++;
    if (sunlight.has(p.care?.sunlight)) score++;
    if (water.has(p.care?.water)) score++;

    return { ...p.toObject(), score };
    });

    // sort by score (highest first)
    scored.sort((a, b) => b.score - a.score);

    // take top 8
    const recommended = scored.slice(0, 8);

    res.json(recommended);
    
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

/* GET ALL PRODUCTS (PUBLIC) */
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: 1 });
    res.json(products);
  } catch (error) {
    console.error("PUBLIC GET products error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

/* GET SINGLE PRODUCT (PUBLIC) */
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (error) {
    console.error("PUBLIC GET product error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

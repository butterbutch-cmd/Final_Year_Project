const express = require("express");
const Product = require("../models/Product");
const authenticate = require("../middleware/authenticate");///this is to verify token of admin user
const checkPermission = require("../middleware/checkPermission");///this is to check if admin user has permission to access product routes

const router = express.Router();

/* ================================
   GET ALL PRODUCTS (ADMIN)
================================ */
router.get(
  "/",
  authenticate,
  checkPermission("products", "view"),
  async (req, res) => {
    try {
      const products = await Product.find().sort({ createdAt: -1 });
      res.json(products);
    } catch (error) {
      console.error("ADMIN GET products error:", error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  }
);  

/* ================================
   CREATE PRODUCT
================================ */
router.post(
  "/",
  authenticate,
  checkPermission("products", "create"),
  async (req, res) => {
    try {
      const product = new Product(req.body);
      await product.save();
      res.status(201).json(product);
    } catch (error) {
      console.error("ADMIN CREATE product error:", error);
      res.status(500).json({ error: "Failed to create product" });
    }
  }
);

/* ================================
   UPDATE PRODUCT
================================ */
router.put(
  "/:id",
  authenticate,
  checkPermission("products", "edit"),
  async (req, res) => {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );

      if (!updatedProduct) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.json(updatedProduct);
    } catch (error) {
      console.error("ADMIN UPDATE product error:", error);
      res.status(500).json({ error: "Failed to update product" });
    }
  }
);

/* ================================
   DELETE PRODUCT
================================ */
router.delete(
  "/:id",
  authenticate,
  checkPermission("products", "delete"),
  async (req, res) => {
    try {
      const deletedProduct = await Product.findByIdAndDelete(req.params.id);

      if (!deletedProduct) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("ADMIN DELETE product error:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

module.exports = router;

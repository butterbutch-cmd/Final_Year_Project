const express = require("express");
const router = express.Router();
const { User } = require("../models/User");
const auth = require("../middleware/auth");

// ✅ Add to cart
router.post("/", auth, async (req, res) => {
  try {
    const { productId, quantity, price } = req.body;

    if (!productId || !quantity || !price) {
      return res.status(400).json({ message: "Missing cart data" });
    }

    const user = await User.findById(req.user._id);

    ///check if the product already exists in the cart, if it does update the quantity and price otherwise add new item to cart
    const existingItem = user.cart.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity = quantity;
      existingItem.price = price;
    } else {
      user.cart.push({ product: productId, quantity, price });
    }

    await user.save();
    res.json({ message: "Added to cart", cart: user.cart });
  } catch (err) {
    console.error("Cart error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get cart
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("cart.product");
    res.json({ cart: user.cart });
  } catch (err) {
    console.error("Cart fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Update cart item quantity
router.put("/update", auth, async (req, res) => {
  try {
    const { productId, action } = req.body;

    if (!productId || !action) {
      return res.status(400).json({ message: "Missing productId or action" });
    }

    const user = await User.findById(req.user._id);

    const item = user.cart.find(
      (item) => item.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    if (action === "increase") {
      item.quantity += 1;
    } else if (action === "decrease") {
      item.quantity = Math.max(1, item.quantity - 1);
    } else {
      return res.status(400).json({ message: "Invalid action" });
    }

    await user.save();
    res.json({ message: "Cart updated", cart: user.cart });
  } catch (err) {
    console.error("Cart update error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Remove item from cart
router.delete("/remove", auth, async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Missing productId" });
    }

    const user = await User.findById(req.user._id);

    user.cart = user.cart.filter(
      (item) => item.product.toString() !== productId
    );

    await user.save();
    res.json({ message: "Item removed", cart: user.cart });
  } catch (err) {
    console.error("Cart remove error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

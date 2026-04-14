// filelocation: Final_Year_Project/Backend/routes/chatbotRoutes.js

const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const { handleMessage, checkHealth } = require("../controllers/chatbotController");

// ── Frontend → Rasa proxy ─────────────────────────────────────────────────────
// Matches: POST /api/chat  (called by src/services/chatAPI.js → sendChatMessage)
router.post("/", handleMessage);

// ── Dev health check ──────────────────────────────────────────────────────────
router.get("/health", checkHealth);

// ── Legacy product lookup ─────────────────────────────────────────────────────
router.get("/product/:name", async (req, res) => {
  try {
    const product = await Product.findOne({
      name: { $regex: req.params.name, $options: "i" },
    });

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({ success: true, data: product });
  } catch (err) {
    console.error("Chatbot Route Error:", err);
    return res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

module.exports = router;
const express = require("express");
const router = express.Router();
const axios = require("axios");

const RAG_SERVICE = process.env.RAG_SERVICE || "http://localhost:8000";

// 🔐 Optional auth middleware (if you have one)
// const auth = require("../middleware/auth");

router.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  // ✅ Better session handling
  const session_id =
    req.user?._id || req.headers["x-session-id"] || `guest_${Date.now()}`;

  try {
    const response = await axios.post(
      `${RAG_SERVICE}/chat`,
      {
        session_id,
        message,
      },
      {
        timeout: 10000, // ⏱️ prevent hanging
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error("Chatbot error:", err.message);

    res.status(500).json({
      error: "Chatbot service unavailable",
    });
  }
});

// 🧹 Clear session
router.delete("/chat/clear", async (req, res) => {
  const session_id =
    req.user?._id || req.headers["x-session-id"];

  if (!session_id) {
    return res.status(400).json({ error: "No session id" });
  }

  try {
    await axios.delete(`${RAG_SERVICE}/session/${session_id}`);
    res.json({ status: "cleared" });
  } catch (err) {
    res.status(500).json({ error: "Failed to clear session" });
  }
});

module.exports = router;
// filelocation: Final_Year_Project/Backend/controllers/chatbotController.js

const axios = require("axios");

const RASA_URL = process.env.RASA_URL || "http://localhost:5005";

/**
 * POST /api/chat
 * Body: { message: string, userId: string }  ← matches chatAPI.js
 */
const handleMessage = async (req, res) => {
  const { message, userId } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ message: "Message is required." });
  }

  try {
    const rasaRes = await axios.post(
      `${RASA_URL}/webhooks/rest/webhook`,
      {
        sender: userId || "anonymous",
        message: message.trim(),
      },
      { timeout: 10000 }
    );

    const botMessages = rasaRes.data;

    if (!botMessages || botMessages.length === 0) {
      return res.json({
        reply:
          "🌿 I'm not sure how to help with that. Try asking about our plants, pricing, or orders!",
      });
    }

    // Rasa can return multiple message objects — join them
    const reply = botMessages
      .map((msg) => msg.text || "")
      .filter(Boolean)
      .join("\n\n");

    return res.json({ reply });
  } catch (error) {
    console.error("Rasa proxy error:", error.message);

    if (error.code === "ECONNREFUSED" || error.code === "ECONNRESET") {
      return res.status(503).json({
        message: "Chatbot service is currently unavailable. Please try again later.",
      });
    }

    return res.status(500).json({
      message: "Something went wrong while processing your message.",
    });
  }
};

/**
 * GET /api/chat/health
 */
const checkHealth = async (req, res) => {
  try {
    const response = await axios.get(`${RASA_URL}/`, { timeout: 5000 });
    return res.json({ status: "ok", rasa: response.data });
  } catch {
    return res.status(503).json({ status: "unavailable" });
  }
};

module.exports = { handleMessage, checkHealth };
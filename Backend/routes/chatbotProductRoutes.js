// filelocation: Final_Year_Project/Backend/routes/chatbotProductRoutes.js

const express = require("express");
const router = express.Router();
const {
  getChatbotProducts,
  checkChatbotAvailability,
} = require("../controllers/chatbotProductController");

// GET /api/products/chatbot              → browse with optional filters
// GET /api/products/chatbot/availability → check a specific plant by name
router.get("/", getChatbotProducts);
router.get("/availability", checkChatbotAvailability);

module.exports = router;
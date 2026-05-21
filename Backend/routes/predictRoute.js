const express = require("express");
const router = express.Router();
const axios = require("axios");
const FormData = require("form-data");
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });
const FLASK_URL = process.env.FLASK_URL || "http://localhost:5001";

// POST /api/predict  — accepts an image upload from React
router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No image provided" });

    // Forward the file to Flask
    const form = new FormData();
    form.append("image", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    const flaskRes = await axios.post(`${FLASK_URL}/predict`, form, {
      headers: form.getHeaders(),
    });

    res.json(flaskRes.data); // { label, confidence, index }
  } catch (err) {
    console.error("Flask error:", err.message);
    res.status(500).json({ error: "Prediction failed" });
  }
});

module.exports = router;
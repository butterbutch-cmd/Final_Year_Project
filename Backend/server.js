require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connection = require('./db');

// ---------------- ROUTES ----------------
const userRoutes = require('./routes/Users');        // ✅ User CRUD & block/unblock
const authRoutes = require('./routes/auth');         // ✅ Login/Register
const passwordRecov = require('./routes/mail');      // ✅ Forgot password / OTP
const productRoutes = require('./routes/productRoutes'); // ✅ Product CRUD

const app = express();

// ---------------- DATABASE ----------------
connection(); // Connect to MongoDB

// ---------------- MIDDLEWARE ----------------
app.use(express.json()); // Parse JSON bodies
app.use(cors());        // Enable CORS

// ---------------- ROUTES ----------------
app.use("/api/users", userRoutes);       // Users routes
app.use("/api/auth", authRoutes);        // Auth routes
app.use("/api/mail", passwordRecov);    // Password recovery routes
app.use("/api/products", productRoutes); // Product routes

// ---------------- DEFAULT ROUTE ----------------
app.get("/", (req, res) => {
  res.send("Hello from backend");
});

// ---------------- SERVER ----------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

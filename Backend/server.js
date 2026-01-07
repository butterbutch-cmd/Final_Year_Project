require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connection = require('./db');

// ---------------- ROUTES ----------------
const userRoutes = require('./routes/Users');
const authRoutes = require('./routes/auth');
const passwordRecov = require('./routes/mail');
const productRoutes = require('./routes/productRoutes');
const adminAuthRoutes = require("./routes/adminAuth");
const adminRoutes = require("./routes/adminRoutes"); // ✅ ADD THIS

const app = express();

// ---------------- DATABASE ----------------
connection();

// ---------------- MIDDLEWARE ----------------
app.use(express.json());
app.use(cors());

// ---------------- ROUTES ----------------
app.use("/api/users", userRoutes);
app.use("/api/admin", adminAuthRoutes);
app.use("/api/admins", adminRoutes); // ✅ CREATE / FETCH / DELETE ADMINS
app.use("/api/auth", authRoutes);
app.use("/api/mail", passwordRecov);
app.use("/api/products", productRoutes);

// ---------------- DEFAULT ROUTE ----------------
app.get("/", (req, res) => {
  res.send("Hello from backend");
});

// ---------------- SERVER ----------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

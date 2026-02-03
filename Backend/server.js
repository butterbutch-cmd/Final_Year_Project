// ///---------------- BACKEND SERVER ----------------
// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const connection = require('./db');

// // ---------------- ROUTES ----------------
// const userRoutes = require('./routes/Users');
// const authRoutes = require('./routes/auth');
// const passwordRecov = require('./routes/mail');

// const publicProducts = require('./routes/publicProducts');   // ✅ Public routes for users
// const adminProducts = require('./routes/adminProducts');     // ✅ Admin routes with RBAC

// const adminAuthRoutes = require("./routes/adminAuth");
// const adminRoutes = require("./routes/adminRoutes");         // ✅ Admin management routes


// // ---------------- EXPRESS APP ----------------
// const app = express();

// // ---------------- DATABASE ----------------
// connection();

// // ---------------- MIDDLEWARE ----------------
// app.use(express.json());
// app.use(cors());

// // ---------------- PUBLIC ROUTES ----------------
// app.use("/api/users", userRoutes);             // User profile routes
// app.use("/api/auth", authRoutes);             // User authentication
// app.use("/api/mail", passwordRecov);          // Password recovery / email
// app.use("/api/products", publicProducts);     // Public product listing / details

// // ---------------- ADMIN ROUTES ----------------
// app.use("/api/admin", adminAuthRoutes);       // Admin login/auth
// app.use("/api/admins", adminRoutes);          // Admin management (create/delete admins)
// app.use("/api/admin/products", adminProducts); // Admin product management (CRUD + RBAC)

// // ---------------- DEFAULT ROUTE ----------------
// app.get("/", (req, res) => {
//   res.send("Hello from backend");
// });

// // ---------------- SERVER ----------------
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// file: Final_Year_Project/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connection = require("./db");

// ---------------- ROUTES ----------------
const userRoutes = require("./routes/Users");
const authRoutes = require("./routes/auth");
const passwordRecov = require("./routes/mail");

const publicProducts = require("./routes/publicProducts");   // Public product routes
const adminProducts = require("./routes/adminProducts");     // Admin product routes (RBAC)

const adminAuthRoutes = require("./routes/adminAuth");
const adminRoutes = require("./routes/adminRoutes");

// ✅ Address routes
const userAddressRoutes = require("./routes/userAddresses");
const userWishlistRoutes = require("./routes/userWishlist");


// ---------------- EXPRESS APP ----------------
const app = express();

// ---------------- DATABASE ----------------
connection();

// ---------------- MIDDLEWARE ----------------
app.use(express.json());
app.use(cors());

// ---------------- PUBLIC ROUTES ----------------
app.use("/api/users", userRoutes);          // User profile routes
app.use("/api/auth", authRoutes);           // User authentication
app.use("/api/mail", passwordRecov);        // Password recovery / email
app.use("/api/products", publicProducts);  // Public product listing

// ✅ User address routes
app.use("/api/user", userAddressRoutes);
app.use("/api/user/wishlist", userWishlistRoutes);


// ---------------- ADMIN ROUTES ----------------
app.use("/api/admin", adminAuthRoutes);         // Admin login/auth
app.use("/api/admins", adminRoutes);            // Admin management
app.use("/api/admin/products", adminProducts); // Admin product CRUD + RBAC

// ---------------- DEFAULT ROUTE ----------------
app.get("/", (req, res) => {
  res.send("Hello from backend");
});

// ---------------- SERVER ----------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

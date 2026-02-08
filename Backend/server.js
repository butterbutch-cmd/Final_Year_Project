require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connection = require("./db");

// ---------------- ROUTES ----------------
const userRoutes = require("./routes/Users");
const authRoutes = require("./routes/auth");
const passwordRecov = require("./routes/mail");

const publicProducts = require("./routes/publicProducts");
const adminProducts = require("./routes/adminProducts");

const adminAuthRoutes = require("./routes/adminAuth");
const adminRoutes = require("./routes/adminRoutes");
const departmentRoutes = require("./routes/department.routes");
const adminUserRoutes = require("./routes/adminUser.routes");

const userAddressRoutes = require("./routes/userAddresses");
const userWishlistRoutes = require("./routes/userWishlist");
const cartRoutes = require("./routes/cart");
const paymentRoutes = require("./routes/PaymentRoutes");
const orderRoutes = require("./routes/order");



// ---------------- EXPRESS APP ----------------
const app = express();

// ---------------- DATABASE ----------------
connection();

// ---------------- CORS CONFIG ----------------
const allowedOrigins = [
  "http://localhost:5000",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
  })
);

// ---------------- BODY PARSER ----------------
app.use(express.json());

// ---------------- PUBLIC ROUTES ----------------
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/mail", passwordRecov);
app.use("/api/products", publicProducts);

// ---------------- USER ROUTES ----------------
app.use("/api/user/addresses", userAddressRoutes);
app.use("/api/user/wishlist", userWishlistRoutes);
app.use("/api/user/cart", cartRoutes);
app.use("/api/user/orders", orderRoutes);

// ---------------- PAYMENT ROUTES ----------------
app.use("/api/payment", paymentRoutes);

// ---------------- ADMIN ROUTES ----------------
app.use("/api/admin", adminAuthRoutes);
app.use("/api/admins", adminRoutes);   ///this is being used by user manger
app.use("/api/admin/products", adminProducts);
app.use("/api/departments", departmentRoutes);
app.use("/api/admin-users", adminUserRoutes);

// ---------------- DEFAULT ROUTE ----------------
app.get("/", (req, res) => {
  res.send("Hello from backend");
});

// ---------------- SERVER ----------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

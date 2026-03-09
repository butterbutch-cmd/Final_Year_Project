require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connection = require("./db");

// ---------------- ROUTES ----------------

// AUTH & USERS
const userRoutes = require("./routes/Users");
const authRoutes = require("./routes/auth");
const passwordRecov = require("./routes/mail");

// PRODUCTS
const publicProducts = require("./routes/publicProducts");
const adminProducts = require("./routes/adminProducts");
const reviewRoutes = require("./routes/reviewRoutes");

// ADMIN AUTH & MANAGEMENT
const adminAuthRoutes = require("./routes/adminAuth");
const adminRoutes = require("./routes/adminRoutes"); // user manager
const departmentRoutes = require("./routes/department.routes");
const adminUserRoutes = require("./routes/adminUser.routes");
const adminReportRoutes = require("./routes/adminReportRoutes"); // ✅ REPORT ROUTES
const moduleRoutes = require('./routes/moduleRoutes');

// USER FEATURES
const userAddressRoutes = require("./routes/userAddresses");
const userWishlistRoutes = require("./routes/userWishlist");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/order");
const forumRoutes = require("./routes/forumRoutes");

// PAYMENTS
const paymentRoutes = require("./routes/PaymentRoutes");        // USER payments
const adminPaymentRoutes = require("./routes/adminPayments");   // ADMIN payments ✅

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

// ==================================================
// ================= PUBLIC ROUTES ==================
// ==================================================
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/mail", passwordRecov);
app.use("/api/products", publicProducts);
app.use("/api/reviews", reviewRoutes);

// ==================================================
// ================= USER ROUTES ====================
// ==================================================
app.use("/api/user/addresses", userAddressRoutes);
app.use("/api/user/wishlist", userWishlistRoutes);
app.use("/api/user/cart", cartRoutes);
app.use("/api/user/orders", orderRoutes);
app.use("/api/forum", forumRoutes);
// ==================================================
// ================= PAYMENT ROUTES =================
// ==================================================

// USER checkout / gateway callbacks
app.use("/api/payment", paymentRoutes);

// ADMIN payment & delivery management (dashboard)
app.use("/api/admin/payments", adminPaymentRoutes);

// ==================================================
// ================= ADMIN ROUTES ===================
// ==================================================
app.use("/api/admin", adminAuthRoutes);
app.use("/api/admin", adminReportRoutes); // ✅ REPORT ROUTES
app.use("/api/admins", adminRoutes);
app.use("/api/admin/products", adminProducts);
app.use("/api/departments", departmentRoutes);
app.use("/api/admin-users", adminUserRoutes);
app.use('/api/modules', moduleRoutes);

// ---------------- DEFAULT ROUTE ----------------
app.get("/", (req, res) => {
  res.send("Hello from backend 🚀");
});

// ---------------- SERVER ----------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

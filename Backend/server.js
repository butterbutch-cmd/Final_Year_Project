//file: Backend/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connection = require("./db");
const http = require("http");
const jwt = require("jsonwebtoken");
const { Server } = require("socket.io");

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
const adminReportRoutes = require("./routes/adminReportRoutes");
const adminForumRoutes = require("./routes/adminForumRoutes"); // ✅ ADDED
const moduleRoutes = require("./routes/moduleRoutes");

// USER FEATURES
const userAddressRoutes = require("./routes/userAddresses");
const userWishlistRoutes = require("./routes/userWishlist");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/order");
const forumRoutes = require("./routes/forumRoutes");

// PAYMENTS
const paymentRoutes = require("./routes/PaymentRoutes");
const adminPaymentRoutes = require("./routes/adminPayments");

////NOTIFICATION
const notificationRoutes = require("./routes/notificationRoutes");

// ---------------- EXPRESS APP ----------------
const app = express();

// ---------------- DATABASE ----------------
connection();

// ---------------- CORS CONFIG ----------------
const allowedOrigins = [
  "http://localhost:5000",
  "http://localhost:5173",
  // add production origins here
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
// ================= SOCKET.IO SETUP =================
// ==================================================
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
  transports: ["websocket", "polling"],
});

// attach io to app
app.set("io", io);

// socket auth
io.use((socket, next) => {
  try {
    const raw = socket.handshake.auth?.token;

    if (!raw) return next();

    const token =
      typeof raw === "string" && raw.startsWith("Bearer ")
        ? raw.split(" ")[1]
        : raw;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    socket.user = decoded;

    return next();
  } catch (err) {
    console.warn("Socket auth failed:", err.message);
    return next();
  }
});

io.on("connection", (socket) => {
  console.log(
    "socket connected:",
    socket.id,
    "user:",
    socket.user?._id || "anon"
  );

  socket.on("thread:join", ({ threadId } = {}) => {
    if (!threadId) return;

    const room = `thread:${threadId}`;
    socket.join(room);
  });

  socket.on("thread:leave", ({ threadId } = {}) => {
    if (!threadId) return;

    const room = `thread:${threadId}`;
    socket.leave(room);
  });

  socket.on("disconnect", (reason) => {
    console.log("socket disconnected:", socket.id, reason);
  });
});

// ==================================================
// ================= PUBLIC ROUTES ==================
// ==================================================
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/mail", passwordRecov);
app.use("/api/products", publicProducts);
app.use("/api/reviews", reviewRoutes);

// ==================================================
// ================= RECOMMENDATION ROUTES ===========
// ==================================================

app.use("/api/recommendations",require("./routes/recommendations"));

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
app.use("/api/payment", paymentRoutes);
app.use("/api/admin/payments", adminPaymentRoutes);

// ==================================================
// ================= ADMIN ROUTES ===================
// ==================================================
app.use("/api/admin", adminAuthRoutes);
app.use("/api/admin", adminReportRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api/admin/products", adminProducts);
app.use("/api/admin/forum", adminForumRoutes); 
app.use("/api/departments", departmentRoutes);
app.use("/api/admin-users", adminUserRoutes);
app.use("/api/modules", moduleRoutes);

// ==================================================
// ================= NOTIFICATION ===================
// ==================================================
app.use("/api/notifications", notificationRoutes);

app.use('/api/chatbot', require('./routes/chatbot'));

// ---------------- DEFAULT ROUTE ----------------
app.get("/", (req, res) => {
  res.send("Hello from backend 🚀");
});

// ---------------- START SERVER ----------------
server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
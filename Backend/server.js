// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const connection = require("./db");

// // ---------------- ROUTES ----------------
// const userRoutes = require("./routes/Users");
// const authRoutes = require("./routes/auth");
// const passwordRecov = require("./routes/mail");

// const publicProducts = require("./routes/publicProducts");   // Public product routes
// const adminProducts = require("./routes/adminProducts");     // Admin product routes (RBAC)

// const adminAuthRoutes = require("./routes/adminAuth");
// const adminRoutes = require("./routes/adminRoutes");

// // ✅ Address routes
// const userAddressRoutes = require("./routes/userAddresses");
// const userWishlistRoutes = require("./routes/userWishlist");


// // ---------------- EXPRESS APP ----------------
// const app = express();

// // ---------------- DATABASE ----------------
// connection();

// // ---------------- MIDDLEWARE ----------------
// app.use(express.json());
// app.use(cors());

// // ---------------- PUBLIC ROUTES ----------------
// app.use("/api/users", userRoutes);          // User profile routes
// app.use("/api/auth", authRoutes);           // User authentication
// app.use("/api/mail", passwordRecov);        // Password recovery / email
// app.use("/api/products", publicProducts);  // Public product listing

// // ✅ User address routes
// app.use("/api/user", userAddressRoutes);
// app.use("/api/user/wishlist", userWishlistRoutes);


// // ---------------- ADMIN ROUTES ----------------
// app.use("/api/admin", adminAuthRoutes);         // Admin login/auth
// app.use("/api/admins", adminRoutes);            // Admin management
// app.use("/api/admin/products", adminProducts); // Admin product CRUD + RBAC

// // ---------------- DEFAULT ROUTE ----------------
// app.get("/", (req, res) => {
//   res.send("Hello from backend");
// });

// // ---------------- SERVER ----------------
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


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

const userAddressRoutes = require("./routes/userAddresses");
const userWishlistRoutes = require("./routes/userWishlist");

const paymentRoutes = require("./routes/PaymentRoutes"); 

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
      // allow server tools like Postman (no origin)
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
app.use("/api/user", userAddressRoutes);
app.use("/api/user/wishlist", userWishlistRoutes);

// ---------------- PAYMENT ROUTES ----------------
app.use("/api/payment", paymentRoutes);

// ---------------- ADMIN ROUTES ----------------
app.use("/api/admin", adminAuthRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api/admin/products", adminProducts);

// ---------------- DEFAULT ROUTE ----------------
app.get("/", (req, res) => {
  res.send("Hello from backend");
});

// ---------------- SERVER ----------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

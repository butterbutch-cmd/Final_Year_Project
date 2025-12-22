require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connection = require('./db');

const userRoutes = require('./routes/Users');
const authRoutes = require('./routes/auth');
const passwordRecov = require('./routes/mail');
const productRoutes = require('./routes/productRoutes'); // ✅ THIS

const app = express();

connection();

app.use(express.json());
app.use(cors());

app.use("/api/Users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/mail", passwordRecov);
app.use("/api/products", productRoutes); // ✅ THIS

app.get("/", (req, res) => {
  res.send("hello from backend");
});

app.listen(5000, () => console.log("Connected to the 5000 port"));

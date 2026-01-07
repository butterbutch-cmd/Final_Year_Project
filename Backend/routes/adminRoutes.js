const express = require("express");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const { User } = require("../models/User");
const auth = require("../middleware/auth"); // YOUR EXISTING AUTH
const superAdmin = require("../middleware/superAdmin");
const sendEmail = require("../utils/sendEmail");

const router = express.Router();

// ------------------ VALIDATION ------------------
const createAdminSchema = Joi.object({
  username: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().min(7).required(),
  role: Joi.string().valid("admin", "moderator", "super_admin").required(),
});

// ------------------ CREATE ADMIN / MODERATOR ------------------
router.post("/", auth, superAdmin, async (req, res) => {
  try {
    const { error } = createAdminSchema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const { username, email, phoneNumber, role } = req.body;

    // ❌ Prevent creating normal users
    if (role === "user") {
      return res.status(400).json({ message: "Cannot create normal users here." });
    }

    // ❌ Check duplicates
    const existingUser = await User.findOne({
      $or: [{ email }, { username }, { phoneNumber }],
    });

    if (existingUser) {
      return res.status(409).json({
        message:
          existingUser.email === email
            ? "Email already exists"
            : existingUser.username === username
            ? "Username already exists"
            : "Phone number already exists",
      });
    }

    // 🔐 Auto password = username + phoneNumber
    const rawPassword = `${username}${phoneNumber}`;
    const saltRounds = Number(process.env.SALT) || 10;
    const hashedPassword = await bcrypt.hash(rawPassword, saltRounds);

    // ✅ Create admin
    const newAdmin = new User({
      username,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      authProvider: "local",
    });

    await newAdmin.save();

    // 📧 Send credentials email
    await sendEmail(
      email,
      "Your Admin Account Credentials",
      `
        <h3>Welcome to FloraVerse Admin Panel</h3>
        <p>Your admin account has been created.</p>
        <p><b>Username:</b> ${username}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Password:</b> ${rawPassword}</p>
        <p>Please login and change your password immediately.</p>
      `
    );

    res.status(201).json({
      message: "Admin / Moderator created and email sent successfully.",
      user: {
        _id: newAdmin._id,
        username: newAdmin.username,
        email: newAdmin.email,
        phoneNumber: newAdmin.phoneNumber,
        role: newAdmin.role,
      },
    });
  } catch (error) {
    console.error("Create admin error:", error);
    res.status(500).json({
      message: "Failed to create admin/moderator",
      error: error.message,
    });
  }
});

// ------------------ GET ADMINS / MODERATORS ------------------
router.get("/", auth, async (req, res) => {
  try {
    const staff = await User.find(
      { role: { $ne: "user" } },
      { password: 0, resetOtp: 0, resetOtpExpire: 0 }
    ).sort({ createdAt: -1 });

    res.json(staff);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch admins." });
  }
});

// ------------------ DELETE ADMIN ------------------
router.delete("/:id", auth, superAdmin, async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Admin deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: "Delete failed." });
  }
});

module.exports = router;

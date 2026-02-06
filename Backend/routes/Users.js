///file location: Final_Year_Project/Backend/routes/Users.js
const express = require("express");
const bcrypt = require("bcrypt");
const { User, validateUserSignup } = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const authenticate = require("../middleware/authenticate");
const checkPermission = require("../middleware/checkPermission");

const router = express.Router();

// -----------------------
// PUBLIC USER SIGNUP
// -----------------------
router.post("/signup", async (req, res) => {
  try {
    // Validate input (username, email, password)
    const { error } = validateUserSignup(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    // Check if email already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser)
      return res.status(409).json({ message: "Email already exists" });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Save user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      authProvider: "local",
    });

    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("User signup error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// -----------------------
// ADMIN / MODERATOR CREATION (AUTH REQUIRED)
// -----------------------
router.post("/", authenticate, checkPermission("users", "create"), async (req, res) => {
  try {
    const { username, email, phoneNumber, role, permissions } = req.body;

    if (!username || !email || !phoneNumber || !role || !permissions) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Only super admin can create another super admin
    if (role === "super_admin" && req.user.role !== "super_admin") {
      return res.status(403).json({
        message: "Only super admins can create another super admin",
      });
    }

    // Check duplicates
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

    // Auto password = username + phoneNumber
    const rawPassword = `${username}${phoneNumber}`;
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    // Create admin
    const newAdmin = new User({
      username,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      permissions,
      authProvider: "local",
    });

    await newAdmin.save();

    // Send credentials email
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
      message: "Admin / Moderator created successfully.",
      user: {
        _id: newAdmin._id,
        username: newAdmin.username,
        email: newAdmin.email,
        phoneNumber: newAdmin.phoneNumber,
        role: newAdmin.role,
        permissions: newAdmin.permissions,
      },
    });
  } catch (err) {
    console.error("Create admin error:", err);
    res.status(500).json({ message: "Failed to create admin/moderator", error: err.message });
  }
});

// -----------------------
// GET ALL USERS (AUTH REQUIRED)
// -----------------------
router.get("/", authenticate, checkPermission("users", "view"), async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error("Get users error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// -----------------------
// BLOCK / UNBLOCK USER (ADMIN ONLY)
// -----------------------
router.put(
  "/:id/block",
  authenticate,
  checkPermission("users", "edit"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { isBlocked, blockReason } = req.body;

      if (typeof isBlocked !== "boolean") {
        return res.status(400).json({ message: "isBlocked must be boolean" });
      }

      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Safety: do not block admins / staff
      if (user.role !== "user") {
        return res.status(403).json({
          message: "You cannot block admin or staff accounts",
        });
      }

      const wasBlocked = user.isBlocked; // 👈 track previous state

      user.isBlocked = isBlocked;
      user.blockReason = isBlocked
        ? blockReason || "Violation of platform policies"
        : "";

      await user.save();

      /* ===============================
         EMAIL: USER BLOCKED
      ================================ */
      if (!wasBlocked && isBlocked) {
        await sendEmail(
          user.email,
          "Your FloraVerse Account Has Been Blocked",
          `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2 style="color:#d32f2f;">Account Block Notification</h2>

            <p>Dear <b>${user.username}</b>,</p>

            <p>Your FloraVerse account has been <b>temporarily blocked</b> for the following reason:</p>

            <blockquote style="background:#f8f8f8; padding:10px; border-left:4px solid #d32f2f;">
              ${user.blockReason}
            </blockquote>

            <p>If you believe this was a mistake, please contact our support team:</p>

            <p>
              📧 <a href="mailto:support@floraverse.com">support@floraverse.com</a>
            </p>

            <p>— FloraVerse Team</p>
          </div>
          `
        );
      }

      /* ===============================
         EMAIL: USER UNBLOCKED ✅
      ================================ */
      if (wasBlocked && !isBlocked) {
        await sendEmail(
          user.email,
          "Your FloraVerse Account Has Been Restored",
          `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2 style="color:#2e7d32;">Account Reactivated</h2>

            <p>Dear <b>${user.username}</b>,</p>

            <p>Good news! 🎉</p>

            <p>Your FloraVerse account has been <b>successfully unblocked</b>. You now have full access to the platform again.</p>

            <p>Please make sure to follow our community guidelines to avoid future restrictions.</p>

            <p>If you have any questions, feel free to contact us:</p>

            <p>
              📧 <a href="mailto:support@floraverse.com">support@floraverse.com</a>
            </p>

            <p>Welcome back 🌱<br/>
            <b>FloraVerse Team</b></p>
          </div>
          `
        );
      }

      res.json({
        message: isBlocked
          ? "User blocked successfully and email sent"
          : "User unblocked successfully and email sent",
        user: {
          _id: user._id,
          isBlocked: user.isBlocked,
          blockReason: user.blockReason,
        },
      });
    } catch (err) {
      console.error("Block user error:", err);
      res.status(500).json({ message: "Failed to update user status" });
    }
  }
);


module.exports = router;

///file location: Final_Year_Project/Backend/routes/Users.js
const express = require("express");
const bcrypt = require("bcrypt");
const { User, validateUserSignup } = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const authenticate = require("../middleware/authenticate");
const checkPermission = require("../middleware/checkPermission");
const sendVerificationEmail = require("../utils/sendVerificationEmail");

const router = express.Router();

// -----------------------
// PUBLIC USER SIGNUP
// -----------------------
// router.post("/signup", async (req, res) => {
//   try {
//     // Validate input (username, email, password) using Joi
//     const { error } = validateUserSignup(req.body);
//     if (error)
//       return res.status(400).json({ message: error.details[0].message });

//     // Check if email and user already exists
//     const existingUser = await User.findOne({ $or: [{ email: req.body.email },{ username: req.body.username }]});

//     if (existingUser) { return res.status(409).json({message: "Username or Email already exists"});}

//     // Hash password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(req.body.password, salt);

//     // Save user
//     const newUser = new User({
//       username: req.body.username,
//       email: req.body.email,
//       password: hashedPassword,
//       authProvider: "local",
//     });

//     await newUser.save();

//     res.status(201).json({ message: "User created successfully" });
//   } catch (err) {
//     console.error("User signup error:", err);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

router.post("/signup", async (req, res) => {
  try {
    const { error } = validateUserSignup(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const existingUser = await User.findOne({
      $or: [{ email: req.body.email }, { username: req.body.username }],
    });

    // ── Already exists but verified → hard block ──────────────────
    if (existingUser && existingUser.isEmailVerified) {
      return res.status(409).json({ message: "Username or Email already exists" });
    }

    // ── Already exists but NOT verified → resend OTP ──────────────
    if (existingUser && !existingUser.isEmailVerified) {
      const otp       = Math.floor(100000 + Math.random() * 900000).toString();
      const hashedOtp = await bcrypt.hash(otp, 10);

      existingUser.emailVerificationOtp       = hashedOtp;
      existingUser.emailVerificationOtpExpire = Date.now() + 10 * 60 * 1000;

      await existingUser.save();

      try {
        await sendVerificationEmail(existingUser.email, otp, existingUser.username);
      } catch (mailErr) {
        console.error("Mail error (resend):", mailErr);
        return res.status(500).json({ message: "Failed to send verification email. Check mail config." });
      }

      return res.status(200).json({
        message: "A new verification code has been sent to your email.",
        email: existingUser.email,
      });
    }

    // ── Brand new user ─────────────────────────────────────────────
    const salt           = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const otp       = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);

    const newUser = new User({
      username:                   req.body.username,
      email:                      req.body.email,
      password:                   hashedPassword,
      authProvider:               "local",
      isEmailVerified:            false,
      emailVerificationOtp:       hashedOtp,
      emailVerificationOtpExpire: Date.now() + 10 * 60 * 1000,
    });

    await newUser.save();

    // ── Isolate mail errors from save errors ───────────────────────
    try {
      await sendVerificationEmail(newUser.email, otp, newUser.username);
    } catch (mailErr) {
      console.error("Mail error (new user):", mailErr);
      // User is saved — don't 500, just warn. They can use resend-otp.
      return res.status(201).json({
        message: "Account created but we couldn't send the verification email. Use 'Resend code'.",
        email: newUser.email,
      });
    }

    res.status(201).json({
      message: "Account created. Please verify your email with the 6-digit code.",
      email: newUser.email,
    });

  } catch (err) {
    console.error("Signup error:", err); // ← read this line in your terminal
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// POST /api/Users/verify-email
router.post("/verify-email", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required." });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: "Email is already verified." });
    }

    // Check expiry
    if (!user.emailVerificationOtpExpire || user.emailVerificationOtpExpire < Date.now()) {
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    // Compare OTP
    const isMatch = await bcrypt.compare(otp, user.emailVerificationOtp);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid OTP. Please try again." });
    }

    // Mark verified and clear OTP fields
    user.isEmailVerified = true;
    user.emailVerificationOtp = null;
    user.emailVerificationOtpExpire = null;
    await user.save();

    res.status(200).json({ message: "Email verified successfully. You can now log in." });
  } catch (err) {
    console.error("Verify email error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// POST /api/Users/resend-otp
router.post("/resend-otp", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found." });
    if (user.isEmailVerified) return res.status(400).json({ message: "Already verified." });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);

    user.emailVerificationOtp = hashedOtp;
    user.emailVerificationOtpExpire = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendVerificationEmail(user.email, otp, user.username);

    res.status(200).json({ message: "A new OTP has been sent to your email." });
  } catch (err) {
    console.error("Resend OTP error:", err);
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

// -----------------------
// DELETE USER (ADMIN ONLY)
// -----------------------
router.delete(
  "/:id",
  authenticate,
  checkPermission("users", "delete"),
  async (req, res) => {
    try {
      const { id } = req.params;

      const user = await User.findById(id);
      if (!user) return res.status(404).json({ message: "User not found" });

      // Safety: do not delete admins / staff
      if (user.role !== "user") {
        return res.status(403).json({
          message: "You cannot delete admin or staff accounts",
        });
      }

      await User.findByIdAndDelete(id);

      res.json({ message: "User deleted successfully" });
    } catch (err) {
      console.error("Delete user error:", err);
      res.status(500).json({ message: "Failed to delete user" });
    }
  }
);



module.exports = router;

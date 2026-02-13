/// file location: Final_Year_Project/Backend/routes/mail.js
const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const { User } = require("../models/User");

/* ===============================
   1️⃣ SEND OTP (Forgot Password)
================================ */
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    // 1️⃣ Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "No account found with this email address",
      });
    }

    // 2️⃣ Block Google-auth users
    if (user.authProvider === "google") {
      return res.status(400).json({
        message:
          "This account was created using Google Sign-In. Password reset is not available. Please log in using Google.",
      });
    }

    // 3️⃣ Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetOtp = otp;
    user.resetOtpExpire = Date.now() + 5 * 60 * 1000; // 5 minutes
    await user.save();

    // 4️⃣ Send email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"FloraVerse Team" <${process.env.EMAIL}>`,
      to: email,
      subject: "FloraVerse | Password Reset Code",
      replyTo: "no-reply@floraverse.com",
      html: `
        <div style="font-family: Arial; padding: 20px;">
          <h2 style="color:#2e7d32">FloraVerse Password Reset</h2>
          <p>Your verification code is:</p>
          <h1 style="letter-spacing:5px">${otp}</h1>
          <p>This code expires in 5 minutes.</p>
          <p>If you didn’t request this, ignore this email.</p>
        </div>
      `,
    });

    res.status(200).json({
      message: "OTP sent successfully",
    });
  } catch (err) {
    console.error("FORGOT PASSWORD ERROR:", err);
    res.status(500).json({
      message: "Failed to send OTP. Please try again later.",
    });
  }
});


/* ===============================
   2️⃣ VERIFY OTP
================================ */
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !user.resetOtp) {
      return res.status(400).json({ message: "Invalid request" });
    }

    if (
      user.resetOtp !== otp ||
      user.resetOtpExpire < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    res.json({ message: "OTP verified" });
  } catch (err) {
    res.status(500).json({ message: "OTP verification failed" });
  }
});

/* ===============================
   3️⃣ RESET PASSWORD
================================ */
router.post("/reset-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({
      message: "Email, OTP and new password are required"
    });
  }

  try {
    const user = await User.findOne({ email });

    // ❌ User not found
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🚫 Block Google-auth users
    if (user.authProvider === "google") {
      return res.status(403).json({
        message: "Password reset is not allowed for Google accounts"
      });
    }

    // ❌ OTP mismatch
    if (user.resetOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // ❌ OTP expired
    if (!user.resetOtpExpire || user.resetOtpExpire < Date.now()) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    // 🔐 Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // 🧹 Cleanup OTP fields
    user.resetOtp = undefined;
    user.resetOtpExpire = undefined;

    await user.save();

    res.status(200).json({
      message: "Password reset successful. Please login again."
    });

  } catch (err) {
    console.error("❌ Reset password error:", err);
    res.status(500).json({ message: "Password reset failed" });
  }
});
module.exports = router;

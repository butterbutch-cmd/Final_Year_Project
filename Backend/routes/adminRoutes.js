const express = require("express");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const { User } = require("../models/User");
const authenticate = require("../middleware/authenticate");
const checkPermission = require("../middleware/checkPermission");
const sendEmail = require("../utils/sendEmail");

const router = express.Router();

// ------------------ VALIDATION ------------------
const createAdminSchema = Joi.object({
  username: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().min(7).required(),
  role: Joi.string().valid("admin", "moderator", "super_admin").required(),
  permissions: Joi.object().required()
});

const updateAdminSchema = Joi.object({
  permissions: Joi.object().required()
});

// ------------------ CREATE ADMIN / MODERATOR ------------------
router.post(
  "/",
  authenticate,
  checkPermission("users", "create"),
  async (req, res) => {
    try {
      const { error } = createAdminSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const { username, email, phoneNumber, role, permissions } = req.body;

      // Only super admin can create another super admin
      if (role === "super_admin" && req.user.role !== "super_admin") {
        return res.status(403).json({
          message: "Only super admins can create another super admin"
        });
      }

      // Check duplicates
      const existingUser = await User.findOne({
        $or: [{ email }, { username }, { phoneNumber }]
      });

      if (existingUser) {
        return res.status(409).json({
          message:
            existingUser.email === email
              ? "Email already exists"
              : existingUser.username === username
              ? "Username already exists"
              : "Phone number already exists"
        });
      }

      // Auto password = username + phoneNumber
      const rawPassword = `${username}${phoneNumber}`;
      const saltRounds = Number(process.env.SALT) || 10;
      const hashedPassword = await bcrypt.hash(rawPassword, saltRounds);

      // Create admin
      const newAdmin = new User({
        username,
        email,
        phoneNumber,
        password: hashedPassword,
        role,
        permissions,
        authProvider: "local"
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
          permissions: newAdmin.permissions
        }
      });
    } catch (error) {
      console.error("Create admin error:", error);
      res.status(500).json({
        message: "Failed to create admin/moderator",
        error: error.message
      });
    }
  }
);

// ------------------ GET ADMINS / MODERATORS ------------------
router.get(
  "/",
  authenticate,
  checkPermission("users", "view"),
  async (req, res) => {
    try {
      const staff = await User.find(
        { role: { $ne: "user" } },
        { password: 0, resetOtp: 0, resetOtpExpire: 0 }
      ).sort({ createdAt: -1 });

      res.json(staff);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch admins." });
    }
  }
);

// ------------------ UPDATE ADMIN (PERMISSIONS ONLY) ------------------
router.put(
  "/:id",
  authenticate,
  checkPermission("users", "edit"),
  async (req, res) => {
    try {
      const { id } = req.params;

      // Validate request body
      const { error } = updateAdminSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      // Prevent editing yourself
      if (id === req.user._id.toString()) {
        return res.status(400).json({
          message: "You cannot edit your own account"
        });
      }

      // Find the admin first to check if exists
      const admin = await User.findById(id);
      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      // Only update permissions
      const updated = await User.findByIdAndUpdate(
        id,
        { permissions: req.body.permissions },
        { new: true }
      ).select("-password -resetOtp -resetOtpExpire");

      res.json({ 
        message: "Admin permissions updated successfully", 
        user: updated 
      });
    } catch (err) {
      console.error("Update admin error:", err);
      res.status(500).json({ 
        message: "Update failed.",
        error: err.message 
      });
    }
  }
);

// ------------------ DELETE ADMIN ------------------
router.delete(
  "/:id",
  authenticate,
  checkPermission("users", "delete"),
  async (req, res) => {
    try {
      const { id } = req.params;

      // Prevent deleting yourself
      if (id === req.user._id.toString()) {
        return res.status(400).json({
          message: "You cannot delete your own account"
        });
      }

      const deleted = await User.findByIdAndDelete(id);

      if (!deleted) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ message: "Admin deleted successfully." });
    } catch (err) {
      res.status(500).json({ message: "Delete failed." });
    }
  }
);

// ------------------ GET CURRENT ADMIN PROFILE ------------------
router.get("/me", authenticate, async (req, res) => {
  try {
    const admin = await User.findById(req.user._id).select(
      "-password -resetOtp -resetOtpExpire"
    );

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json({
      _id: admin._id,
      username: admin.username,
      email: admin.email,
      role: admin.role,
      permissions: admin.permissions
    });
  } catch (err) {
    console.error("GET /me error:", err);
    res.status(500).json({ message: "Failed to fetch admin profile" });
  }
});

module.exports = router;
const bcrypt = require("bcrypt");
const Joi = require("joi");
const { User } = require("../models/User");
const sendEmail = require("../utils/sendEmail");

const createAdminSchema = Joi.object({
  username: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().min(7).required(),
  role: Joi.string().valid("admin", "moderator", "super_admin").required(),
  permissions: Joi.object().required()
});

// ---------------- CREATE ----------------
exports.createAdmin = async (req, res) => {
  try {
    const { error } = createAdminSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { username, email, phoneNumber, role, permissions } = req.body;

    if (role === "super_admin" && req.user.role !== "super_admin") {
      return res.status(403).json({
        message: "Only super admins can create another super admin"
      });
    }

    const exists = await User.findOne({
      $or: [{ email }, { username }, { phoneNumber }]
    });

    if (exists) {
      return res.status(409).json({ message: "Admin already exists" });
    }

    const rawPassword = `${username}${phoneNumber}`;
    const hashedPassword = await bcrypt.hash(
      rawPassword,
      Number(process.env.SALT) || 10
    );

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

    await sendEmail(
      email,
      "Your Admin Credentials",
      `
      <h3>Admin Panel Access</h3>
      <p><b>Username:</b> ${username}</p>
      <p><b>Password:</b> ${rawPassword}</p>
      <p>Please change your password after login.</p>
      `
    );

    res.status(201).json({
      message: "Admin created successfully",
      user: {
        _id: newAdmin._id,
        username: newAdmin.username,
        email: newAdmin.email,
        role: newAdmin.role
      }
    });
  } catch (err) {
    console.error("Create admin error:", err);
    res.status(500).json({ message: "Failed to create admin" });
  }
};

// ---------------- GET ----------------
exports.getAdmins = async (req, res) => {
  try {
    const staff = await User.find(
      { role: { $ne: "user" } },
      { password: 0, resetOtp: 0, resetOtpExpire: 0 }
    ).sort({ createdAt: -1 });

    res.json(staff);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch admins" });
  }
};

// ---------------- UPDATE ----------------
exports.updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    if (id === req.user._id.toString()) {
      return res.status(400).json({
        message: "You cannot edit your own account"
      });
    }

    const updated = await User.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    ).select("-password");

    if (!updated) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json({ message: "Admin updated", user: updated });
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
};

// ---------------- DELETE ----------------
exports.deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    if (id === req.user._id.toString()) {
      return res.status(400).json({
        message: "You cannot delete your own account"
      });
    }

    const deleted = await User.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json({ message: "Admin deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};

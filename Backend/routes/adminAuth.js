const router = require("express").Router();
const bcrypt = require("bcrypt");
const Joi = require("joi");
const { User, validateLogin } = require("../models/User");

/* ===========================================
   DEV ONLY – SUPER ADMIN SIGNUP
=========================================== */
router.post("/signup", async (req, res) => {
  try {
    // ✅ Local validator (DEV ONLY)
    const schema = Joi.object({
      username: Joi.string().min(3).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    });

    const { error } = schema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    // Check existing user
    let user = await User.findOne({ email: req.body.email });
    if (user)
      return res.status(409).json({ message: "Email already exists" });

    // Hash password
    const saltRounds = parseInt(process.env.SALT) || 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    // Create SUPER ADMIN
    user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      authProvider: "local",
      role: "super_admin",
    });

    await user.save();

    const token = user.generateAuthToken();

    res.status(201).json({
      token,
      role: user.role,
      message: "Super Admin created (DEV ONLY)",
    });

  } catch (err) {
    console.error("Admin Signup Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

/* ===========================================
   ADMIN / SUPER ADMIN LOGIN
=========================================== */
router.post("/login", async (req, res) => {
  try {
    const { error } = validateLogin(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    if (!user.password)
      return res.status(400).json({ message: "User has no password set" });

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res.status(400).json({ message: "Invalid email or password" });

    // ✅ ONLY admin & super_admin
    if (!["super_admin", "admin"].includes(user.role)) {
      return res.status(403).json({ message: "Access denied. Not an admin." });
    }

    const token = user.generateAuthToken();

    res.json({
      token,
      role: user.role,
      message: `Logged in as ${user.role.replace("_", " ").toUpperCase()}`,
    });

  } catch (err) {
    console.error("Admin Login Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;

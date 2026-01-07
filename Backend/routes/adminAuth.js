const router = require("express").Router();
const bcrypt = require("bcrypt");
const { User, validate, validateLogin } = require("../models/User");

/* ===========================================
   ADMIN SIGNUP (DEV ONLY)
   - Creates a super_admin user
   - Handles duplicate email safely
=========================================== */
router.post("/signup", async (req, res) => {
  try {
    // Validate input
    const { error } = validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    // Check if email already exists
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(409).json({ message: "Email already exists" });

    // Hash password
    const saltRounds = parseInt(process.env.SALT) || 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    // Create super admin
    user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      authProvider: "local",
      role: "super_admin", // 🔥 force role for dev
    });

    await user.save();

    // Generate JWT token
    const token = user.generateAuthToken();

    res.status(201).json({
      token,
      role: user.role,
      message: "Super Admin created (Dev Only)"
    });

  } catch (err) {
    console.error("Admin Signup Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

/* ===========================================
   ADMIN LOGIN
   - Validates login safely
   - Works even if password is missing
   - Forces super_admin role for dev
=========================================== */
router.post("/login", async (req, res) => {
  try {
    const { error } = validateLogin(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    if (!user.password) return res.status(400).json({ message: "User has no password set." });

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).json({ message: "Invalid email or password" });

    // Only allow admin roles to login
    const allowedRoles = ["super_admin", "admin", "moderator"];
    if (!allowedRoles.includes(user.role))
      return res.status(403).json({ message: "Access denied. Not an admin." });

    const token = user.generateAuthToken();

    res.json({
      token,
      role: user.role,
      message: `Logged in as ${user.role.replace("_", " ").toUpperCase()}`
    });

  } catch (err) {
    console.error("Admin Login Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});


module.exports = router;

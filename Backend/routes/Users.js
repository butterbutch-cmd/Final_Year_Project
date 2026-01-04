const router = require("express").Router();
const { User, validate } = require('../models/User');
const bcrypt = require('bcrypt');

// ---------------- CREATE USER ----------------
router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser)
      return res.status(409).send({ message: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    await new User({
      username: req.body.username,
      email: req.body.email,
      password: hashPassword,
      authProvider: "local"
    }).save();

    res.status(201).send({ message: "User created successfully" });
  } catch (err) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// ---------------- GET ALL USERS ----------------
router.get("/", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------- UPDATE USER ----------------
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const updatedUser = await User.findByIdAndUpdate(id, payload, { new: true });
    if (!updatedUser) return res.status(404).json({ message: "User not found" });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------- DELETE USER ----------------
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

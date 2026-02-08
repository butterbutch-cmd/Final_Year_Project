const express = require("express");
const router = express.Router();
const { User } = require("../models/User");
const Department = require("../models/Department");

// CREATE ADMIN USER WITH DEPARTMENT
router.post("/create-admin", async (req, res) => {
  try {
    const { username, email, password, departmentId } = req.body;

    if (!departmentId) {
      return res.status(400).json({ message: "Department is required" });
    }

    const department = await Department.findById(departmentId);
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    const admin = new User({
      username,
      email,
      password,
      role: "admin",
      department: department._id,
      permissions: department.permissions, // inherit permissions
    });

    await admin.save();

    res.status(201).json({
      message: "Admin created successfully",
      admin,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET ALL ADMINS WITH DEPARTMENT
router.get("/admins", async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" })
      .populate("department", "name description");
    res.json(admins);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

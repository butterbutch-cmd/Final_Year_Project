// routes/department.routes.js
const express = require("express");
const router = express.Router();
const Department = require("../models/Department");

// CREATE DEPARTMENT
router.post("/", async (req, res) => {
  try {
    const department = new Department(req.body);
    await department.save();
    res.status(201).json(department);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET ALL DEPARTMENTS
router.get("/", async (req, res) => {
  try {
    const departments = await Department.find();
    res.json(departments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET SINGLE DEPARTMENT
router.get("/:id", async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }
    res.json(department);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE DEPARTMENT
router.put("/:id", async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(department);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE DEPARTMENT
router.delete("/:id", async (req, res) => {
  try {
    await Department.findByIdAndDelete(req.params.id);
    res.json({ message: "Department deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

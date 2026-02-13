const express = require('express');
const router = express.Router();
const Module = require('../models/Module');
const User = require('../models/User');
const Department = require('../models/Department');
const adminAuth = require("../middleware/auth");

// ==================== GET ALL ACTIVE MODULES ====================
// GET all active modules
router.get('/', async (req, res) => {
  try {
    const modules = await Module.find({ isActive: true }).lean(); // <-- lean() returns plain JS array
    res.json(Array.isArray(modules) ? modules : []);            // <-- enforce array
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch modules" });
  }
});

// ==================== CREATE A NEW MODULE ====================
router.post('/', adminAuth, async (req, res) => {
  try {
    const { name, label, defaultPermissions, isActive } = req.body;

    if (!name || !label) {
      return res.status(400).json({ error: "Module name and label are required" });
    }

    const module = await Module.create({ name, label, defaultPermissions, isActive });
    res.status(201).json(module);
  } catch (err) {
    console.error("Error creating module:", err);
    res.status(400).json({ error: err.message });
  }
});

// ==================== UPDATE A MODULE ====================
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const module = await Module.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!module) return res.status(404).json({ error: "Module not found" });
    res.json(module);
  } catch (err) {
    console.error("Error updating module:", err);
    res.status(400).json({ error: err.message });
  }
});

// ==================== DELETE (OR DEACTIVATE) MODULE ====================
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const module = await Module.findByIdAndDelete(req.params.id);
    if (!module) return res.status(404).json({ error: "Module not found" });
    res.json({ message: 'Module deleted successfully' });
  } catch (err) {
    console.error("Error deleting module:", err);
    res.status(500).json({ error: err.message });
  }
});

// ==================== REFRESH PERMISSIONS FOR EXISTING USERS & DEPARTMENTS ====================
router.post('/:id/refresh', adminAuth, async (req, res) => {
  try {
    const module = await Module.findById(req.params.id);
    if (!module) return res.status(404).json({ error: 'Module not found' });

    const updateOps = {
      $set: { [`permissions.${module.name}`]: module.defaultPermissions }
    };

    // Update all users that don't have this module yet
    await User.updateMany(
      { [`permissions.${module.name}`]: { $exists: false } },
      updateOps
    );

    // Update all departments similarly
    await Department.updateMany(
      { [`permissions.${module.name}`]: { $exists: false } },
      updateOps
    );

    res.json({ message: 'Permissions refreshed for all existing users and departments' });
  } catch (err) {
    console.error("Error refreshing module permissions:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

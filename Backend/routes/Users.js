// const router = require("express").Router();
// const { User, validate } = require('../models/User');
// const bcrypt = require('bcrypt');
// const sendEmail = require("../utils/sendEmail"); // ✅ For sending block/unblock emails

// // ---------------- CREATE USER ----------------
// router.post("/", async (req, res) => {
//   try {
//     const { error } = validate(req.body);
//     if (error)
//       return res.status(400).send({ message: error.details[0].message });

//     const existingUser = await User.findOne({ email: req.body.email });
//     if (existingUser)
//       return res.status(409).send({ message: "Email already exists" });

//     const salt = await bcrypt.genSalt(10);
//     const hashPassword = await bcrypt.hash(req.body.password, salt);

//     await new User({
//       username: req.body.username,
//       email: req.body.email,
//       password: hashPassword,
//       authProvider: "local"
//     }).save();

//     res.status(201).send({ message: "User created successfully" });
//   } catch (err) {
//     console.error("Create user error:", err);
//     res.status(500).send({ message: "Internal Server Error" });
//   }
// });

// // ---------------- GET ALL USERS ----------------
// router.get("/", async (req, res) => {
//   try {
//     const users = await User.find().sort({ createdAt: -1 });
//     res.json(users);
//   } catch (err) {
//     console.error("Get users error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // ---------------- UPDATE USER (BLOCK/UNBLOCK INCLUDED) ----------------
// router.put("/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { isBlocked, blockReason, ...otherFields } = req.body;

//     // Prepare update object
//     const updateData = { ...otherFields };
//     if (typeof isBlocked === "boolean") {
//       updateData.isBlocked = isBlocked;
//       if (isBlocked) updateData.blockReason = blockReason || "";
//     }

//     // Update user in DB (without triggering full schema validation)
//     const user = await User.findByIdAndUpdate(id, updateData, { new: true });
//     if (!user) return res.status(404).json({ message: "User not found" });

//     // Send block/unblock email
//     if (isBlocked && blockReason) {
//       const subject = "Account Blocked Notification";
//       const html = `
//         <p>Hi ${user.username},</p>
//         <p>Your account has been <strong>blocked</strong> by the admin.</p>
//         <p>Reason: ${blockReason}</p>
//         <p>If you think this is a mistake, please contact support.</p>
//       `;
//       await sendEmail(user.email, subject, html);
//     } else if (!isBlocked) {
//       const subject = "Account Unblocked";
//       const html = `
//         <p>Hi ${user.username},</p>
//         <p>Your account has been <strong>unblocked</strong> by the admin. You can now log in.</p>
//         <p>Welcome back!</p>
//       `;
//       await sendEmail(user.email, subject, html);
//     }

//     res.json({ message: "User updated successfully", user });
//   } catch (err) {
//     console.error("Update user error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // ---------------- DELETE USER ----------------
// router.delete("/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deletedUser = await User.findByIdAndDelete(id);
//     if (!deletedUser) return res.status(404).json({ message: "User not found" });
//     res.json({ message: "User deleted successfully" });
//   } catch (err) {
//     console.error("Delete user error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;

const router = require("express").Router();
const { User, validate } = require("../models/User");
const bcrypt = require("bcrypt");
const sendEmail = require("../utils/sendEmail");

const authenticate = require("../middleware/authenticate");

// ================= PERMISSION MIDDLEWARE =================
const checkPermission = (action) => {
  return (req, res, next) => {
    const perms = req.user.permissions?.users;

    if (!perms || perms[action] !== true) {
      return res.status(403).json({
        message: "Access denied: insufficient permissions",
      });
    }
    next();
  };
};

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
      authProvider: "local",
    }).save();

    res.status(201).send({ message: "User created successfully" });
  } catch (err) {
    console.error("Create user error:", err);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// ---------------- GET ALL USERS ----------------
router.get(
  "/",
  authenticate,
  checkPermission("view"),
  async (req, res) => {
    try {
      const users = await User.find().sort({ createdAt: -1 });
      res.json(users);
    } catch (err) {
      console.error("Get users error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// ---------------- UPDATE USER (BLOCK / UNBLOCK) ----------------
router.put(
  "/:id",
  authenticate,
  checkPermission("edit"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { isBlocked, blockReason, ...otherFields } = req.body;

      const updateData = { ...otherFields };

      if (typeof isBlocked === "boolean") {
        updateData.isBlocked = isBlocked;
        if (isBlocked) updateData.blockReason = blockReason || "";
      }

      const user = await User.findByIdAndUpdate(id, updateData, {
        new: true,
      });

      if (!user) return res.status(404).json({ message: "User not found" });

      // Send emails
      if (isBlocked && blockReason) {
        await sendEmail(
          user.email,
          "Account Blocked",
          `
          <p>Hi ${user.username},</p>
          <p>Your account has been <strong>blocked</strong>.</p>
          <p>Reason: ${blockReason}</p>
          `
        );
      } else if (!isBlocked) {
        await sendEmail(
          user.email,
          "Account Unblocked",
          `
          <p>Hi ${user.username},</p>
          <p>Your account has been <strong>unblocked</strong>.</p>
          `
        );
      }

      res.json({ message: "User updated successfully", user });
    } catch (err) {
      console.error("Update user error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// ---------------- DELETE USER ----------------
router.delete(
  "/:id",
  authenticate,
  checkPermission("delete"),
  async (req, res) => {
    try {
      const { id } = req.params;

      const deletedUser = await User.findByIdAndDelete(id);
      if (!deletedUser)
        return res.status(404).json({ message: "User not found" });

      res.json({ message: "User deleted successfully" });
    } catch (err) {
      console.error("Delete user error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;

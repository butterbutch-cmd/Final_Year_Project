// //file: Final_Year_Project/Backend/routes/Users.js
// const router = require("express").Router();
// const { User, validateUserSignup } = require("../models/User");
// const bcrypt = require("bcrypt");
// const sendEmail = require("../utils/sendEmail");

// const authenticate = require("../middleware/authenticate");

// // ================= PERMISSION MIDDLEWARE =================
// const checkPermission = (action) => {
//   return (req, res, next) => {
//     const perms = req.user.permissions?.users;

//     if (!perms || perms[action] !== true) {
//       return res.status(403).json({
//         message: "Access denied: insufficient permissions",
//       });
//     }
//     next();
//   };
// };

// // ---------------- CREATE USER ----------------
// router.post("/", async (req, res) => {
//   try {
//     const { error } = validateUserSignup(req.body);
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
//       authProvider: "local",
//     }).save();

//     res.status(201).send({ message: "User created successfully" });
//   } catch (err) {
//     console.error("Create user error:", err);
//     res.status(500).send({ message: "Internal Server Error" });
//   }
// });

// // ---------------- GET ALL USERS ----------------
// router.get(
//   "/",
//   authenticate,
//   checkPermission("view"),
//   async (req, res) => {
//     try {
//       const users = await User.find().sort({ createdAt: -1 });
//       res.json(users);
//     } catch (err) {
//       console.error("Get users error:", err);
//       res.status(500).json({ message: "Server error" });
//     }
//   }
// );

// // ---------------- UPDATE USER (BLOCK / UNBLOCK) ----------------
// router.put(
//   "/:id",
//   authenticate,
//   checkPermission("edit"),
//   async (req, res) => {
//     try {
//       const { id } = req.params;
//       const { isBlocked, blockReason, ...otherFields } = req.body;

//       const updateData = { ...otherFields };

//       if (typeof isBlocked === "boolean") {
//         updateData.isBlocked = isBlocked;
//         if (isBlocked) updateData.blockReason = blockReason || "";
//       }

//       const user = await User.findByIdAndUpdate(id, updateData, {
//         new: true,
//       });

//       if (!user) return res.status(404).json({ message: "User not found" });

//       // Send emails
//       if (isBlocked && blockReason) {
//         await sendEmail(
//           user.email,
//           "Account Blocked",
//           `
//           <p>Hi ${user.username},</p>
//           <p>Your account has been <strong>blocked</strong>.</p>
//           <p>Reason: ${blockReason}</p>
//           `
//         );
//       } else if (!isBlocked) {
//         await sendEmail(
//           user.email,
//           "Account Unblocked",
//           `
//           <p>Hi ${user.username},</p>
//           <p>Your account has been <strong>unblocked</strong>.</p>
//           `
//         );
//       }

//       res.json({ message: "User updated successfully", user });
//     } catch (err) {
//       console.error("Update user error:", err);
//       res.status(500).json({ message: "Server error" });
//     }
//   }
// );

// // ---------------- DELETE USER ----------------
// router.delete(
//   "/:id",
//   authenticate,
//   checkPermission("delete"),
//   async (req, res) => {
//     try {
//       const { id } = req.params;

//       const deletedUser = await User.findByIdAndDelete(id);
//       if (!deletedUser)
//         return res.status(404).json({ message: "User not found" });

//       res.json({ message: "User deleted successfully" });
//     } catch (err) {
//       console.error("Delete user error:", err);
//       res.status(500).json({ message: "Server error" });
//     }
//   }
// );

// module.exports = router;



const express = require("express");
const bcrypt = require("bcrypt");
const { User, validateUserSignup } = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const authenticate = require("../middleware/authenticate");
const checkPermission = require("../middleware/checkPermission");

const router = express.Router();

// -----------------------
// PUBLIC USER SIGNUP
// -----------------------
router.post("/signup", async (req, res) => {
  try {
    // Validate input (username, email, password)
    const { error } = validateUserSignup(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    // Check if email already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser)
      return res.status(409).json({ message: "Email already exists" });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Save user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      authProvider: "local",
    });

    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("User signup error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// -----------------------
// ADMIN / MODERATOR CREATION (AUTH REQUIRED)
// -----------------------
router.post("/", authenticate, checkPermission("users", "create"), async (req, res) => {
  try {
    const { username, email, phoneNumber, role, permissions } = req.body;

    if (!username || !email || !phoneNumber || !role || !permissions) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Only super admin can create another super admin
    if (role === "super_admin" && req.user.role !== "super_admin") {
      return res.status(403).json({
        message: "Only super admins can create another super admin",
      });
    }

    // Check duplicates
    const existingUser = await User.findOne({
      $or: [{ email }, { username }, { phoneNumber }],
    });

    if (existingUser) {
      return res.status(409).json({
        message:
          existingUser.email === email
            ? "Email already exists"
            : existingUser.username === username
            ? "Username already exists"
            : "Phone number already exists",
      });
    }

    // Auto password = username + phoneNumber
    const rawPassword = `${username}${phoneNumber}`;
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    // Create admin
    const newAdmin = new User({
      username,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      permissions,
      authProvider: "local",
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
        permissions: newAdmin.permissions,
      },
    });
  } catch (err) {
    console.error("Create admin error:", err);
    res.status(500).json({ message: "Failed to create admin/moderator", error: err.message });
  }
});

// -----------------------
// GET ALL USERS (AUTH REQUIRED)
// -----------------------
router.get("/", authenticate, checkPermission("users", "view"), async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error("Get users error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

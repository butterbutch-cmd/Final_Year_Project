  const router = require("express").Router();
  const { User, validateLogin } = require("../models/User");
  const auth = require('../middleware/auth');
  const bcrypt = require("bcrypt");
  const jwt = require("jsonwebtoken");
  const admin = require("../config/firebaseAdmin"); // Firebase Admin SDK

  /* =========================
    NORMAL LOGIN
  ========================= */
  router.post("/login", async (req, res) => {
    try {
      // 1️⃣ Joi validation
      const { error } = validateLogin(req.body);
      if (error)
        return res.status(400).json({ message: error.details[0].message });

      const { email, password } = req.body;

      // 2️⃣ Find user
      const user = await User.findOne({ email });
      if (!user)
        return res.status(400).json({ message: "Invalid email or password" });

      // 🔴 Blocked users
      if (user.isBlocked) {
        return res.status(403).json({ message: "Your account has been blocked. Check Mail for Reason." });
      }

      // 🔴 Block non-regular users
      if (user.role !== "user") {
        return res.status(403).json({ message: "Only regular users can log in here" });
      }

      // 3️⃣ Check auth provider
      if (user.authProvider !== "local") {
        return res.status(400).json({
          message: "This account uses Google Sign-In. Please continue with Google."
        });
      }

      // 4️⃣ Check password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword)
        return res.status(400).json({ message: "Invalid email or password" });

      // 5️⃣ Generate JWT
      const token = jwt.sign(
        { _id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "2d" }
      );

      res.status(200).json({
        message: "Login successful",
        jwt: token,
        user,
      });

    } catch (err) {
      console.error("LOGIN ERROR:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });


  /* =========================
    GOOGLE LOGIN
  ========================= */
  router.post("/google", async (req, res) => {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "No token provided" });
    }

    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      const { uid, email, name, picture } = decodedToken;

      if (!email) {
        return res.status(400).json({ message: "Google account has no email" });
      }

      let user = await User.findOne({ email });

      if (user && user.isBlocked) {
        return res.status(403).json({ message: "Your account has been blocked. Contact support & Check mail for reason." });
      }

      if (!user) {
        user = await User.create({
          username: name || email.split("@")[0],
          email,
          authProvider: "google",
          firebaseUid: uid,
          profilePic: picture,
        });
      }

      const jwtToken = jwt.sign(
        { _id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.status(200).json({
        message: "Google login successful",
        jwt: jwtToken,
        user,
      });

    } catch (err) {
      console.error("GOOGLE TOKEN VERIFY ERROR:", err);
      res.status(401).json({ message: "Invalid Google token" });
    }
  });


  /* =========================
    GET CURRENT USER
  ========================= */
  router.get("/me", auth, async (req, res) => {
    try {
      const user = await User.findById(req.user._id).select("username email phoneNumber profilePic addresses authProvider");

      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  });

  /* =========================
    UPDATE CURRENT USER
  ========================= */


router.patch("/me", auth, async (req, res) => {
  try {
    const { username, phoneNumber } = req.body;

    if (!username && !phoneNumber) {
      return res.status(400).json({ message: "Nothing to update" });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (username) user.username = username;
    if (phoneNumber) user.phoneNumber = phoneNumber;

    await user.save();

    res.json({
      _id: user._id,
      username: user.username,
      phoneNumber: user.phoneNumber,
      email: user.email,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

  /* =========================
    SET PASSWORD FOR GOOGLE USERS
  ========================= */

router.patch("/set-password", auth, async (req, res) => {
  try {
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const user = await User.findById(req.user.id);

    if (user.authProvider !== "google") {
      return res.status(400).json({ message: "Password already exists for this account" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    user.authProvider = "local";

    await user.save();

    res.json({ message: "Password set successfully. You can now log in with email and password." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

  /* =========================
    CHANGE PASSWORD
  ========================= */

router.patch("/change-password", auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);

    // 🔒 BLOCK GOOGLE USERS
    if (user.authProvider !== "local") {
      return res.status(403).json({
        message: "Password change not allowed for Google accounts",
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});




  module.exports = router;

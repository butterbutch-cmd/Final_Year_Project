const router = require("express").Router();
const { User, validateLogin } = require("../models/User");
const auth =require('../middleware/auth')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const admin = require("../config/firebaseAdmin"); // Firebase Admin SDK


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

    // 🔴 IMPORTANT FIX
    if (user.authProvider !== "local") {
      return res.status(400).json({
        message: "This account uses Google Sign-In. Please continue with Google."
      });
    }

    // 3️⃣ Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(400).json({ message: "Invalid email or password" });

    // 4️⃣ Generate JWT
    const token = jwt.sign(
      { _id: user._id, email: user.email },
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



// -------------------------
// GOOGLE AUTH LOGIN/SIGNUP
// -------------------------
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
      { _id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Google login successful",
      jwt: jwtToken,   // 🔥 MUST BE `jwt`
      user,
    });

  } catch (err) {
    console.error("GOOGLE TOKEN VERIFY ERROR:", err);
    res.status(401).json({ message: "Invalid Google token" });
  }
});



// -------------------------
// GET CURRENT USER
// -------------------------
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("username email profilePic");
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});





module.exports = router;

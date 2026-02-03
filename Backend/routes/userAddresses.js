const router = require("express").Router();
const { User } = require("../models/User");
const auth = require("../middleware/auth");

// ===================== GET USER ADDRESSES =====================
router.get("/addresses", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("addresses");
    res.json(user.addresses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ===================== ADD ADDRESS =====================
router.post("/addresses", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const { fullName, phoneNumber, street, city, postalCode, state, country, isDefault } = req.body;

    // Validate required fields
    if (!fullName || !phoneNumber || !street || !city || !postalCode) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    // If new address is default, unset old default
    if (isDefault) {
      user.addresses.forEach(addr => (addr.isDefault = false));
    }

    const newAddress = {
      fullName,
      phoneNumber,
      street,
      city,
      postalCode,
      state: state || "",
      country: country || "Nepal",
      isDefault: isDefault || false,
    };

    user.addresses.push(newAddress);
    await user.save();

    // Return only the newly added address
    const savedAddress = user.addresses[user.addresses.length - 1];
    res.status(201).json(savedAddress);
  } catch (err) {
    console.error("Error saving address:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// ===================== DELETE ADDRESS =====================
router.delete("/addresses/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.addresses = user.addresses.filter(addr => addr._id.toString() !== req.params.id);
    await user.save();
    res.json(user.addresses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ===================== SET DEFAULT ADDRESS =====================
router.patch("/addresses/:id/default", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.addresses.forEach(addr => {
      addr.isDefault = addr._id.toString() === req.params.id;
    });
    await user.save();
    res.json(user.addresses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

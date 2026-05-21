const router = require("express").Router();
const { User } = require("../models/User");
const auth = require("../middleware/auth");

// ===================== GET USER ADDRESSES =====================
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("addresses");
    res.json(user.addresses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ===================== ADD ADDRESS =====================
router.post("/", auth, async (req, res) => {
  try {
    ///query to find the user by id 
    const user = await User.findById(req.user._id);

    const { street, city, postalCode, state, country, isDefault } = req.body;

    if (!street || !city || !postalCode) {
      return res.status(400).json({
        message: "Street, city, and postal code are required",
      });
    }
    //checking if new address is set as default then update other address to false
    if (isDefault) {
      user.addresses.forEach(addr => (addr.isDefault = false));
    }

    const newAddress = {
      street,
      city,
      postalCode,
      state: state || "",
      country: country || "Nepal",
      isDefault: isDefault || false,
    };
    user.addresses.push(newAddress);
    await user.save();

    res.status(201).json(user.addresses[user.addresses.length - 1]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ===================== DELETE ADDRESS =====================
router.delete("/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.addresses = user.addresses.filter(
      addr => addr._id.toString() !== req.params.id
    );
    await user.save();
    res.json(user.addresses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ===================== SET DEFAULT =====================
router.patch("/:id/default", auth, async (req, res) => {
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

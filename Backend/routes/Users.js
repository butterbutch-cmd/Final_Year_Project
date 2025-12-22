const router =require("express").Router();
const {User, validate} = require('../models/User');
const bcrypt = require('bcrypt');
//const auth = require('../middleware/auth')

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


module.exports = router;

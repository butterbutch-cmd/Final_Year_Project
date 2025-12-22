const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },

  // 🔑 Password only for LOCAL users
  password: { 
    type: String,
    required: function () {
      return this.authProvider === "local";
    }
  },

  // 🔐 Auth Provider
  authProvider: {
    type: String,
    enum: ["local", "google"],
    required: true,
    default: "local"
  },

  // 🔥 Firebase UID (only for Google users)
  firebaseUid: {
    type: String
  },

  profilePic: String,

  // 🔐 Forgot Password (OTP) — LOCAL ONLY
  resetOtp: String,
  resetOtpExpire: Date
});


userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, username: this.username },
    process.env.JWTPRIVATEKEY,
    { expiresIn: "1d" }
  );
  return token;
};

const User = mongoose.model("User", userSchema);

// Signup validation
const validate = (data) => {
  const schema = Joi.object({
    username: Joi.string().required().label("Username"),
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().required().label("Password")
  });
  return schema.validate(data);
};

// Login validation
const validateLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().required().label("Password")
  });
  return schema.validate(data);
};

module.exports = { User, validate, validateLogin };

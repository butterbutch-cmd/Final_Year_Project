const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { 
    type: String,
    required: function () {
      return this.authProvider === "local";
    }
  },
  authProvider: {
    type: String,
    enum: ["local", "google"],
    required: true,
    default: "local"
  },
  firebaseUid: String,
  profilePic: String,
  resetOtp: String,
  resetOtpExpire: Date,

  /* NEW FIELDS */
  isBlocked: { type: Boolean, default: false },  // to track blocked users
  role: { type: String, enum: ["user", "admin"], default: "user" }, // optional
}, { timestamps: true }); // timestamps gives createdAt + updatedAt



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

const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

// -------------------- SCHEMA --------------------
const userSchema = new mongoose.Schema(
  {
    username: { 
      type: String, 
      required: true, 
      unique: true, 
      trim: true 
    },

    email: { 
      type: String, 
      required: true, 
      unique: true, 
      lowercase: true, 
      trim: true 
    },

    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    password: { 
      type: String, 
      required: function () {
        return this.authProvider === "local";
      },
    },

    authProvider: {
      type: String,
      enum: ["local", "google"],
      required: true,
      default: "local",
    },

    firebaseUid: String,
    profilePic: String,

    resetOtp: String,
    resetOtpExpire: Date,

    isBlocked: { type: Boolean, default: false },

    role: { 
      type: String, 
      enum: ["user", "admin", "super_admin", "moderator"], 
      default: "user" 
    },

    // 🔥 optional invitation token for email-based login
    invitationToken: String,
    invitationExpires: Date,
  },
  { timestamps: true }
);

// -------------------- JWT TOKEN --------------------
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { 
      _id: this._id, 
      username: this.username,
      role: this.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return token;
};

// -------------------- VALIDATION --------------------
const validate = (data) => {
  const schema = Joi.object({
    username: Joi.string().required().label("Username"),
    email: Joi.string().email().required().label("Email"),
    phoneNumber: Joi.string().required().label("Phone Number"),
    password: Joi.string().required().label("Password"),
  });
  return schema.validate(data);
};

const validateLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().required().label("Password"),
  });
  return schema.validate(data);
};

const User = mongoose.model("User", userSchema);

module.exports = { User, validate, validateLogin };

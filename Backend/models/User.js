const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

// ==================== PERMISSIONS SUB-SCHEMA ====================
const permissionSchema = new mongoose.Schema(
  {
    view: { type: Boolean, default: false },
    create: { type: Boolean, default: false },
    edit: { type: Boolean, default: false },
    delete: { type: Boolean, default: false },
  },
  { _id: false }
);

const permissionsSchema = new mongoose.Schema(
  {
    products: { type: permissionSchema, default: () => ({ view: true }) },
    users: { type: permissionSchema, default: () => ({}) },
    orders: { type: permissionSchema, default: () => ({ view: true }) },
    payments: { type: permissionSchema, default: () => ({}) },
    content: {
      type: permissionSchema,
      default: () => ({
        view: true,
        create: true,
        edit: true,
        delete: true,
      }),
    },
  },
  { _id: false }
);

// ==================== ADDRESS SUB-SCHEMA ====================
const addressSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      trim: true,
      required: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
      required: true,
    },
    street: {
      type: String,
      trim: true,
      required: true,
    },
    city: {
      type: String,
      trim: true,
      required: true,
    },
    state: {
      type: String,
      trim: true,
      default: "",
    },
    postalCode: {
      type: String,
      trim: true,
      required: true,
    },
    country: {
      type: String,
      trim: true,
      default: "Nepal",
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { _id: true, timestamps: true }
);

// ==================== USER SCHEMA ====================
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phoneNumber: {
      type: String,
      trim: true,
      default: "",
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

    firebaseUid: {
      type: String,
      default: null,
    },

    profilePic: {
      type: String,
      default: "",
    },

    // ==================== ADDRESSES ====================
    addresses: {
      type: [addressSchema],
      default: [],
    },

    // ==================== PASSWORD RESET ====================
    resetOtp: {
      type: String,
      default: null,
    },

    resetOtpExpire: {
      type: Date,
      default: null,
    },

    // ==================== ACCOUNT STATUS ====================
    isBlocked: {
      type: Boolean,
      default: false,
    },

    blockReason: {
      type: String,
      default: "",
    },

    // ==================== ROLE ====================
    role: {
      type: String,
      enum: ["user", "admin", "super_admin", "moderator"],
      default: "user",
    },

    // ==================== PERMISSIONS ====================
    permissions: {
      type: permissionsSchema,
      default: function () {
        if (this.role === "super_admin") {
          return {
            products: { view: true, create: true, edit: true, delete: true },
            users: { view: true, create: true, edit: true, delete: true },
            orders: { view: true, create: true, edit: true, delete: true },
            payments: { view: true, create: true, edit: true, delete: true },
            content: { view: true, create: true, edit: true, delete: true },
          };
        }
        return undefined;
      },
    },

    // ==================== WISHLIST ====================
    wishlist: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Product", // Change to your product/plant model name
      default: [],
    },
  },
  { timestamps: true }
);

// ==================== JWT TOKEN ====================
userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
      role: this.role,
      permissions: this.permissions,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

// ==================== VALIDATIONS ====================

// Permission Joi
const permissionJoi = Joi.object({
  view: Joi.boolean().required(),
  create: Joi.boolean().required(),
  edit: Joi.boolean().required(),
  delete: Joi.boolean().required(),
});

// -------------------- USER SIGNUP (FULL) --------------------
const validate = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(30).required().label("Username"),
    email: Joi.string().email().required().label("Email"),
    phoneNumber: Joi.string().allow("").optional().label("Phone Number"),
    password: Joi.string().min(6).required().label("Password"),
    role: Joi.string()
      .valid("user", "admin", "super_admin", "moderator")
      .required(),

    permissions: Joi.object({
      products: permissionJoi,
      users: permissionJoi,
      orders: permissionJoi,
      payments: permissionJoi,
      content: permissionJoi,
    }).optional(),
  });

  return schema.validate(data);
};

// -------------------- USER SIGNUP (PUBLIC) --------------------
const validateUserSignup = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(30).required().label("Username"),
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().min(6).required().label("Password"),
  });

  return schema.validate(data);
};

// -------------------- ADMIN SIGNUP (DEV ONLY) --------------------
const validateAdminSignup = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(30).required().label("Username"),
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().min(6).required().label("Password"),
  });

  return schema.validate(data);
};

// -------------------- LOGIN --------------------
const validateLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().required().label("Password"),
  });

  return schema.validate(data);
};

// ==================== MODEL ====================
const User = mongoose.model("User", userSchema);

// ==================== EXPORTS ====================
module.exports = {
  User,
  validate,
  validateAdminSignup,
  validateLogin,
  validateUserSignup,
};

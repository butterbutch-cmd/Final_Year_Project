// models/User.js
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

/* ==================== CART ITEM SUB-SCHEMA ==================== */
const cartItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, min: 1, default: 1, required: true },
    price: { type: Number, required: true }, // snapshot price
  },
  { _id: true }
);

/* ==================== ORDER ITEM SUB-SCHEMA ==================== */
const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, min: 1, required: true },
    price: { type: Number, required: true }, // snapshot price
  },
  { _id: true }
);

/* ==================== ADDRESS SUB-SCHEMA ==================== */
const addressSchema = new mongoose.Schema(
  {
    street: { type: String, trim: true, required: true },
    city: { type: String, trim: true, required: true },
    state: { type: String, trim: true, default: "" },
    postalCode: { type: String, trim: true, required: true },
    country: { type: String, trim: true, default: "Nepal" },
    isDefault: { type: Boolean, default: false },
  },
  { _id: true, timestamps: true }
);

/* ==================== ORDER SUB-SCHEMA ==================== */
const orderSchema = new mongoose.Schema(
  {
    transactionId: { type: mongoose.Schema.Types.ObjectId, ref: "Transaction", required: true },
    items: { type: [orderItemSchema], default: [] },
    totalAmount: { type: Number, required: true },
    paymentGateway: { type: String, required: true },

    // ✅ Add CANCELLED to status enum
    status: { type: String, enum: ["COMPLETED", "FAILED", "CANCELLED"], default: "COMPLETED" },

    // ✅ Optional: track delivery separately
    deliveryStatus: { type: String, enum: ["PENDING", "SHIPPED", "DELIVERED", "CANCELLED"], default: "PENDING" },

    deliveryAddress: { type: addressSchema, required: true },
    purchasedAt: { type: Date, default: Date.now },

    // Optional: store cancellation info
    cancellation: {
      reason: { type: String, default: null },
      cancelledAt: { type: Date, default: null },
    },
  },
  { _id: true }
);


/* ==================== PERMISSIONS SUB-SCHEMA ==================== */
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
    content: { type: permissionSchema, default: () => ({ view: true, create: true, edit: true, delete: true }) },
    reviews: { type: permissionSchema, default: () => ({ view: true, create: true, edit: true, delete: true }) }, // ✅ ADD THIS
  },
  { _id: false }
);


/* ==================== USER SCHEMA ==================== */
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phoneNumber: { type: String, trim: true, default: "" },
    password: {
      type: String,
      required: function () {
        return this.authProvider === "local";
      },
    },
    authProvider: { type: String, enum: ["local", "google"], default: "local", required: true },
    firebaseUid: { type: String, default: null },
    profilePic: { type: String, default: "" },

    /* ==================== ADDRESSES ==================== */
    addresses: { type: [addressSchema], default: [] },

    /* ==================== CART ==================== */
    cart: { type: [cartItemSchema], default: [] },

    /* ==================== ORDERS ==================== */
    orders: { type: [orderSchema], default: [] },

    /* ==================== WISHLIST ==================== */
    wishlist: { type: [mongoose.Schema.Types.ObjectId], ref: "Product", default: [] },

    /* ==================== PASSWORD RESET ==================== */
    resetOtp: { type: String, default: null },
    resetOtpExpire: { type: Date, default: null },

    /* ==================== ACCOUNT STATUS ==================== */
    isBlocked: { type: Boolean, default: false },
    blockReason: { type: String, default: "" },

    /* ==================== ROLE ==================== */
    role: {
      type: String,
      enum: ["user", "admin", "super_admin"], // updated roles
      default: "user",
    },

    /* ==================== DEPARTMENT LINK ==================== */
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: function () {
        return this.role === "admin"; // only admin requires department
      },
    },

    /* ==================== PERMISSIONS ==================== */
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
        return undefined; // normal users have no extra permissions
      },
    },
  },
  { timestamps: true }
);

/* ==================== JWT TOKEN ==================== */
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

/* ==================== VALIDATIONS ==================== */
const permissionJoi = Joi.object({
  view: Joi.boolean().required(),
  create: Joi.boolean().required(),
  edit: Joi.boolean().required(),
  delete: Joi.boolean().required(),
});

const validateUserSignup = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};

const validateLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });
  return schema.validate(data);
};

/* ==================== MODEL ==================== */
const User = mongoose.model("User", userSchema);

/* ==================== EXPORTS ==================== */
module.exports = {
  User,
  validateUserSignup,
  validateLogin,
};

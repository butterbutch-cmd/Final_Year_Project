// const mongoose = require("mongoose");
// const jwt = require("jsonwebtoken");
// const Joi = require("joi");

// const Module = require("./Module");
// const Department = require("./Department");

// /* ==================== CART ITEM SUB-SCHEMA ==================== */
// const cartItemSchema = new mongoose.Schema(
//   {
//     product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
//     quantity: { type: Number, min: 1, default: 1, required: true },
//     price: { type: Number, required: true },
//   },
//   { _id: true }
// );

// /* ==================== ORDER ITEM SUB-SCHEMA ==================== */
// const orderItemSchema = new mongoose.Schema(
//   {
//     product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
//     quantity: { type: Number, min: 1, required: true },
//     price: { type: Number, required: true },
//   },
//   { _id: true }
// );

// /* ==================== ADDRESS SUB-SCHEMA ==================== */
// const addressSchema = new mongoose.Schema(
//   {
//     street: { type: String, trim: true, required: true },
//     city: { type: String, trim: true, required: true },
//     state: { type: String, trim: true, default: "" },
//     postalCode: { type: String, trim: true, required: true },
//     country: { type: String, trim: true, default: "Nepal" },
//     isDefault: { type: Boolean, default: false },
//   },
//   { _id: true, timestamps: true }
// );

// /* ==================== ORDER SUB-SCHEMA ==================== */
// const orderSchema = new mongoose.Schema(
//   {
//     transactionId: { type: mongoose.Schema.Types.ObjectId, ref: "Transaction", required: true },
//     items: { type: [orderItemSchema], default: [] },
//     totalAmount: { type: Number, required: true },
//     paymentGateway: { type: String, required: true },
//     status: {
//       type: String,
//       enum: ["PENDING", "COMPLETED", "FAILED", "REFUNDED", "CANCELLED"],
//       default: "PENDING",
//     },
//     deliveryStatus: {
//       type: String,
//       enum: ["PENDING", "SHIPPED", "DELIVERED", "CANCELLED"],
//       default: "PENDING",
//     },
//     deliveryAddress: { type: addressSchema, required: true },
//     purchasedAt: { type: Date, default: Date.now },
//     cancellation: {
//       reason: { type: String, default: null },
//       cancelledAt: { type: Date, default: null },
//     },
//   },
//   { _id: true }
// );

// /* ==================== PERMISSION VALUE SUB-SCHEMA ==================== */
// const permissionValueSchema = new mongoose.Schema(
//   {
//     view: { type: Boolean, default: false },
//     create: { type: Boolean, default: false },
//     edit: { type: Boolean, default: false },
//     delete: { type: Boolean, default: false },
//   },
//   { _id: false }
// );

// /* ==================== USER SCHEMA ==================== */
// const userSchema = new mongoose.Schema(
//   {
//     username: { type: String, required: true, trim: true },
//     email: { type: String, required: true, unique: true, lowercase: true, trim: true },
//     phoneNumber: { type: String, trim: true, default: "" },

//     password: {
//       type: String,
//       required: function () {
//         return this.authProvider === "local";
//       },
//     },

//     authProvider: {
//       type: String,
//       enum: ["local", "google"],
//       default: "local",
//       required: true,
//     },

//     firebaseUid: { type: String, default: null },
//     profilePic: { type: String, default: "" },

//     addresses: { type: [addressSchema], default: [] },
//     cart: { type: [cartItemSchema], default: [] },
//     orders: { type: [orderSchema], default: [] },

//     wishlist: {
//       type: [mongoose.Schema.Types.ObjectId],
//       ref: "Product",
//       default: [],
//     },

//     resetOtp: { type: String, default: null },
//     resetOtpExpire: { type: Date, default: null },

//     isBlocked: { type: Boolean, default: false },
//     blockReason: { type: String, default: "" },

//     role: {
//       type: String,
//       enum: ["user", "admin", "super_admin"],
//       default: "user",
//     },

//     department: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Department",
//       required: function () {
//         return this.role === "admin";
//       },
//     },

//     permissions: {
//       type: Map,
//       of: permissionValueSchema,
//       default: () => new Map(),
//     },
//   },
//   { timestamps: true }
// );

// /* ==================== AUTO-GENERATE PERMISSIONS ==================== */
// userSchema.pre("save", async function (next) {
//   try {
//     if (this.role !== "admin" && this.role !== "super_admin") {
//       return next();
//     }

//     const modules = await Module.find({ isActive: true });

//     // Reset permissions before regenerating
//     this.permissions = new Map();

//     // SUPER ADMIN → FULL ACCESS
//     if (this.role === "super_admin") {
//       modules.forEach((mod) => {
//         this.permissions.set(mod.name, {
//           view: true,
//           create: true,
//           edit: true,
//           delete: true,
//         });
//       });

//       return next();
//     }

//     // ADMIN → INHERIT FROM DEPARTMENT
//     if (this.role === "admin") {
//       const department = await Department.findById(this.department);

//       if (!department) return next();

//       modules.forEach((mod) => {
//         const deptPerm =
//           department.permissions?.get?.(mod.name) ||
//           department.permissions?.[mod.name];

//         this.permissions.set(mod.name, {
//           view: deptPerm?.view ?? mod.defaultPermissions?.view ?? false,
//           create: deptPerm?.create ?? mod.defaultPermissions?.create ?? false,
//           edit: deptPerm?.edit ?? mod.defaultPermissions?.edit ?? false,
//           delete: deptPerm?.delete ?? mod.defaultPermissions?.delete ?? false,
//         });
//       });
//     }

//     next();
//   } catch (err) {
//     next(err);
//   }
// });

// /* ==================== JWT TOKEN ==================== */
// userSchema.methods.generateAuthToken = function () {
//   const permissionsObj = {};

//   for (const [key, value] of this.permissions) {
//     permissionsObj[key] = value;
//   }

//   return jwt.sign(
//     {
//       _id: this._id,
//       username: this.username,
//       role: this.role,
//       permissions: permissionsObj,
//     },
//     process.env.JWT_SECRET,
//     { expiresIn: "1d" }
//   );
// };

// /* ==================== VALIDATIONS ==================== */
// const validateUserSignup = (data) => {
//   const schema = Joi.object({
//     username: Joi.string().min(3).max(30).required(),
//     email: Joi.string().email().required(),
//     password: Joi.string().min(6).required(),
//   });
//   return schema.validate(data);
// };

// const validateLogin = (data) => {
//   const schema = Joi.object({
//     email: Joi.string().email().required(),
//     password: Joi.string().required(),
//   });
//   return schema.validate(data);
// };

// /* ==================== MODEL ==================== */
// const User = mongoose.model("User", userSchema);

// module.exports = {
//   User,
//   validateUserSignup,
//   validateLogin,
// };


const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const Module = require("./Module");
const Department = require("./Department");

/* ==================== CART ITEM SUB-SCHEMA ==================== */
const cartItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, min: 1, default: 1, required: true },
    price: { type: Number, required: true },
  },
  { _id: true }
);

/* ==================== ORDER ITEM SUB-SCHEMA ==================== */
const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, min: 1, required: true },
    price: { type: Number, required: true },
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
    status: {
      type: String,
      enum: ["PENDING", "COMPLETED", "FAILED", "REFUNDED", "CANCELLED"],
      default: "PENDING",
    },
    deliveryStatus: {
      type: String,
      enum: ["PENDING", "SHIPPED", "DELIVERED", "CANCELLED"],
      default: "PENDING",
    },
    deliveryAddress: { type: addressSchema, required: true },
    purchasedAt: { type: Date, default: Date.now },
    cancellation: {
      reason: { type: String, default: null },
      cancelledAt: { type: Date, default: null },
    },
  },
  { _id: true }
);

/* ==================== PERMISSION VALUE SUB-SCHEMA ==================== */
const permissionValueSchema = new mongoose.Schema(
  {
    view: { type: Boolean, default: false },
    create: { type: Boolean, default: false },
    edit: { type: Boolean, default: false },
    delete: { type: Boolean, default: false },
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

    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
      required: true,
    },

    firebaseUid: { type: String, default: null },
    profilePic: { type: String, default: "" },

    addresses: { type: [addressSchema], default: [] },
    cart: { type: [cartItemSchema], default: [] },
    orders: { type: [orderSchema], default: [] },

    wishlist: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Product",
      default: [],
    },

    resetOtp: { type: String, default: null },
    resetOtpExpire: { type: Date, default: null },

    isBlocked: { type: Boolean, default: false },
    blockReason: { type: String, default: "" },

    role: {
      type: String,
      enum: ["user", "admin", "super_admin"],
      default: "user",
    },

    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: function () {
        return this.role === "admin";
      },
    },

    permissions: {
      type: Map,
      of: permissionValueSchema,
      default: () => new Map(),
    },
  },
  { timestamps: true }
);

/* ==================== AUTO-GENERATE PERMISSIONS ==================== */
userSchema.pre("save", async function () {
  // Only run for admin or super_admin
  if (this.role !== "admin" && this.role !== "super_admin") return;

  const modules = await Module.find({ isActive: true });

  // Reset permissions before regenerating
  this.permissions = new Map();

  // SUPER ADMIN → FULL ACCESS
  if (this.role === "super_admin") {
    modules.forEach((mod) => {
      this.permissions.set(mod.name, {
        view: true,
        create: true,
        edit: true,
        delete: true,
      });
    });
    return;
  }

  // ADMIN → INHERIT FROM DEPARTMENT
  if (this.role === "admin") {
    const department = await Department.findById(this.department);

    // If department missing (e.g., new Google user), assign defaults
    modules.forEach((mod) => {
      const deptPerm =
        department?.permissions?.get?.(mod.name) ||
        department?.permissions?.[mod.name];

      this.permissions.set(mod.name, {
        view: deptPerm?.view ?? mod.defaultPermissions?.view ?? false,
        create: deptPerm?.create ?? mod.defaultPermissions?.create ?? false,
        edit: deptPerm?.edit ?? mod.defaultPermissions?.edit ?? false,
        delete: deptPerm?.delete ?? mod.defaultPermissions?.delete ?? false,
      });
    });
  }
});

/* ==================== JWT TOKEN ==================== */
userSchema.methods.generateAuthToken = function () {
  const permissionsObj = {};

  for (const [key, value] of this.permissions) {
    permissionsObj[key] = value;
  }

  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
      role: this.role,
      permissions: permissionsObj,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

/* ==================== VALIDATIONS ==================== */
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

module.exports = {
  User,
  validateUserSignup,
  validateLogin,
};

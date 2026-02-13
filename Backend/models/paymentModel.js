// models/paymentModel.js
const mongoose = require("mongoose");

/* ============================= */
/* ======= CART ITEM SCHEMA ===== */
/* ============================= */
const cartItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 1 },
});

/* ============================= */
/* ===== TRANSACTION SCHEMA ===== */
/* ============================= */
const transactionSchema = new mongoose.Schema(
  {
    /* ===== USER ===== */
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    /* ===== CUSTOMER DETAILS ===== */
    customerDetails: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },

    /* ===== CART ITEMS ===== */
    cartItems: {
      type: [cartItemSchema],
      required: true,
      validate: [(val) => val.length > 0, "Cart cannot be empty"],
    },

    /* ===== PAYMENT ===== */
    amount: { type: Number, required: true, min: 0 },
    // added "cod" to enum
    payment_gateway: {
      type: String,
      required: true,
      enum: ["esewa", "khalti", "cod"],
    },
    status: {
      type: String,
      required: true,
      enum: ["PENDING", "COMPLETED", "FAILED", "REFUNDED", "CANCELLED"],
      default: "PENDING",
    },

    /* ===== DELIVERY ===== */
    deliveryStatus: {
      type: String,
      enum: ["PENDING", "SHIPPED", "DELIVERED", "CANCELLED"],
      default: "PENDING",
    },
    deliveryAddress: {
      type: {
        label: String,
        street: String,
        city: String,
        state: String,
        postalCode: String,
        country: String,
        isDefault: Boolean,
      },
      required: true,
    },

    /* ===== STOCK UPDATE FLAG ===== */
    stockUpdated: { type: Boolean, default: false }, // ensures idempotency

    /* ===== CANCELLATION INFO ===== */
    cancellation: {
      reason: { type: String, default: null },       // user's reason for cancellation
      cancelledAt: { type: Date, default: null },    // timestamp when cancelled
    },
  },
  { timestamps: true } // adds createdAt & updatedAt automatically
);

/* ============================= */
/* ===== EXPORT MODEL ===== */
/* ============================= */
const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;

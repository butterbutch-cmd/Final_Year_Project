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
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    customerDetails: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },

    cartItems: {
      type: [cartItemSchema],
      required: true,
      validate: [(val) => val.length > 0, "Cart cannot be empty"],
    },

    amount: { type: Number, required: true, min: 0 },
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

    stockUpdated: { type: Boolean, default: false },

    // ── eSewa: fresh UUID per payment attempt to avoid 409 session conflicts ──
    esewaTransactionUUID: { type: String, default: null },

    // ── Email idempotency flags (were living only in controller, now persisted) ──
    emailSent: { type: Boolean, default: false },
    codEmailSent: { type: Boolean, default: false },

    cancellation: {
      reason: { type: String, default: null },
      cancelledAt: { type: Date, default: null },
    },
  },
  { timestamps: true }
);


/* ============================= */
/* ===== EXPORT MODEL ===== */
/* ============================= */
const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;

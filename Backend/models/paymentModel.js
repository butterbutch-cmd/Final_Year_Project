// models/paymentModel.js
const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 1 },
});

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
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
    payment_gateway: { type: String, required: true, enum: ["esewa", "khalti"] },
    status: {
      type: String,
      required: true,
      enum: ["PENDING", "COMPLETED", "FAILED", "REFUNDED"],
      default: "PENDING",
    },
    stockUpdated: { type: Boolean, default: false }, // <- ensures idempotency
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
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;

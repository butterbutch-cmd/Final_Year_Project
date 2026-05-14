const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: [
        "order_confirmed",
        "payment_success",
        "payment_failed",
        "order_shipped",
        "order_delivered",
        "forum_reply",
        "forum_like",
        "chatbot_reply",
        "plant_back",
        "new_plants",
        "coupon",
        "password_changed",
        "low_stock",
        "wishlist_price_drop",
      ],
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    link: {
      type: String,
    },

    sendEmail: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
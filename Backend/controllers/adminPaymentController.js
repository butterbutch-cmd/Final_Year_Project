///file: Backend/controllers/adminPaymentController.js
const Transaction = require("../models/paymentModel");
const sendNotification = require("../utils/sendNotification");
const sendEmail = require("../utils/sendEmail");
const { User } = require("../models/User");
const mongoose = require("mongoose");

const DELIVERY_STATUSES = ["PENDING", "SHIPPED", "DELIVERED", "CANCELLED"];
const PAYMENT_STATUSES = ["PENDING", "COMPLETED", "FAILED", "REFUNDED", "CANCELLED"];

async function findOrder(txnId) {
  return User.findOne({ "orders.transactionId": txnId }, { "orders.$": 1 }).lean();
}

/* =====================
   GET ALL PAYMENTS
===================== */
exports.getAllPayments = async (_, res) => {
  const txns = await Transaction.find().sort({ createdAt: -1 }).lean();
  res.json(txns);
};

/* =====================
   GET PAYMENT BY ID
===================== */
exports.getPaymentById = async (req, res) => {
  const txn = await Transaction.findById(req.params.id).lean();
  if (!txn) return res.status(404).json({ message: "Not found" });
  res.json(txn);
};

/* =====================
   UPDATE PAYMENT STATUS
===================== */
exports.updatePaymentStatus = async (req, res) => {
  const { status } = req.body;
  if (!PAYMENT_STATUSES.includes(status))
    return res.status(400).json({ message: "Invalid status" });

  const txn = await Transaction.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  if (!txn) return res.status(404).json({ message: "Not found" });
  res.json(txn);
};

/* =====================
   UPDATE DELIVERY STATUS
===================== */
exports.updateDeliveryStatus = async (req, res) => {
  try {
    const { deliveryStatus } = req.body;

    if (!DELIVERY_STATUSES.includes(deliveryStatus)) {
      return res.status(400).json({ message: "Invalid delivery status" });
    }

    // ✅ POPULATE USER DIRECTLY (BEST PRACTICE)
    const txn = await Transaction.findById(req.params.id).populate("user");

    if (!txn) return res.status(404).json({ message: "Not found" });

    // 🚫 Prevent updating already delivered orders
    if (txn.deliveryStatus === "DELIVERED") {
      return res.status(400).json({ message: "Delivered orders are locked" });
    }

    // 🚫 Prevent duplicate updates
    if (txn.deliveryStatus === deliveryStatus) {
      return res.json(txn);
    }

    // Update status
    txn.deliveryStatus = deliveryStatus;

    if (deliveryStatus === "DELIVERED") txn.status = "COMPLETED";
    if (deliveryStatus === "CANCELLED") txn.status = "CANCELLED";

    await txn.save();

    /* =========================
       👤 USER FROM POPULATE
    ========================== */
    const user = txn.user;

    console.log("👤 USER:", user?._id);
    console.log("📧 EMAIL:", user?.email);

    /* =========================
       🔔 NOTIFICATION DATA
    ========================== */
    let title = "";
    let message = "";

    if (deliveryStatus === "SHIPPED") {
      title = "Order Shipped 🚚";
      message =
        "Your order has been shipped and will arrive in 3–5 business days.";
    }

    if (deliveryStatus === "DELIVERED") {
      title = "Order Delivered ✅";
      message =
        "Your order has been successfully delivered. We hope you enjoy your purchase!";
    }

    /* =========================
       SEND NOTIFICATION + EMAIL
    ========================== */
    if (
      (deliveryStatus === "SHIPPED" || deliveryStatus === "DELIVERED") &&
      user
    ) {
      // 🔔 DATABASE NOTIFICATION
      await sendNotification({
        user: user._id,
        title,
        message,
        type:
          deliveryStatus === "SHIPPED"
            ? "order_shipped"
            : "order_delivered",
        link: `/orders`, // FIXED
        sendEmail: true,
      });

      // 📧 EMAIL SAFETY CHECK
      if (user.email && user.email.trim() !== "") {
        try {
          await sendEmail({
            to: user.email,
            subject: title,
            text: message,
          });

          console.log("📧 Email sent successfully");
        } catch (emailErr) {
          console.error("❌ Email failed:", emailErr.message);
        }
      } else {
        console.log("⚠️ No email found, skipping email");
      }
    }

    /* =========================
       SYNC USER ORDER
    ========================== */
    await User.updateOne(
      { "orders.transactionId": txn._id },
      {
        $set: {
          "orders.$.deliveryStatus": deliveryStatus,
          "orders.$.status": txn.status,
        },
      }
    );

    res.json(txn);
  } catch (error) {
    console.error("❌ Delivery update error:", error);
    res.status(500).json({ message: error.message });
  }
};

/* =====================
   REFUND
===================== */
exports.refundPayment = async (req, res) => {
  const txn = await Transaction.findById(req.params.id);
  if (!txn) return res.status(404).json({ message: "Not found" });

  txn.status = "REFUNDED";
  txn.deliveryStatus = "CANCELLED";
  await txn.save();

  await User.updateOne(
    { "orders.transactionId": txn._id },
    {
      $set: {
        "orders.$.status": "CANCELLED",
        "orders.$.deliveryStatus": "CANCELLED",
        "orders.$.cancellation.reason": "Refunded by admin",
        "orders.$.cancellation.cancelledAt": new Date(),
      },
    }
  );

  res.json(txn);
};

// // // const Transaction = require("../models/paymentModel");

// // // /* ================================
// // //    GET ALL PAYMENTS
// // // ================================ */
// // // exports.getAllPayments = async (req, res) => {
// // //   try {
// // //     const payments = await Transaction.find()
// // //       .populate("user", "username email")
// // //       .sort({ createdAt: -1 });

// // //     // normalize status to lowercase for frontend
// // //     const normalized = payments.map((p) => ({
// // //       ...p.toObject(),
// // //       status: p.status.toLowerCase(),
// // //     }));

// // //     res.json(normalized);
// // //   } catch (err) {
// // //     console.error("getAllPayments:", err);
// // //     res.status(500).json({ message: "Failed to fetch payments" });
// // //   }
// // // };

// // // /* ================================
// // //    GET PAYMENT BY ID
// // // ================================ */
// // // exports.getPaymentById = async (req, res) => {
// // //   try {
// // //     const payment = await Transaction.findById(req.params.id)
// // //       .populate("user", "username email");

// // //     if (!payment) {
// // //       return res.status(404).json({ message: "Transaction not found" });
// // //     }

// // //     res.json({
// // //       ...payment.toObject(),
// // //       status: payment.status.toLowerCase(),
// // //     });
// // //   } catch (err) {
// // //     console.error("getPaymentById:", err);
// // //     res.status(500).json({ message: "Failed to fetch transaction" });
// // //   }
// // // };




// // // /* ================================
// // //    UPDATE PAYMENT STATUS
// // // ================================ */
// // // exports.updatePaymentStatus = async (req, res) => {
// // //   try {
// // //     const { status } = req.body;
// // //     if (!status) {
// // //       return res.status(400).json({ message: "Status is required" });
// // //     }

// // //     const allowed = ["pending", "completed", "failed", "refunded", "cancelled"];
// // //     if (!allowed.includes(status)) {
// // //       return res.status(400).json({ message: "Invalid status value" });
// // //     }

// // //     const payment = await Transaction.findById(req.params.id);
// // //     if (!payment) {
// // //       return res.status(404).json({ message: "Transaction not found" });
// // //     }

// // //     payment.status = status.toUpperCase();

// // //     // if cancelled or refunded → mark delivery cancelled
// // //     if (["cancelled", "refunded"].includes(status)) {
// // //       payment.deliveryStatus = "CANCELLED";
// // //     }

// // //     await payment.save();

// // //     res.json({
// // //       message: "Payment status updated",
// // //       status: payment.status.toLowerCase(),
// // //     });
// // //   } catch (err) {
// // //     console.error("updatePaymentStatus:", err);
// // //     res.status(500).json({ message: "Failed to update status" });
// // //   }
// // // };

// // // /* ================================
// // //    REFUND PAYMENT
// // // ================================ */
// // // exports.refundPayment = async (req, res) => {
// // //   try {
// // //     const payment = await Transaction.findById(req.params.id);
// // //     if (!payment) {
// // //       return res.status(404).json({ message: "Transaction not found" });
// // //     }

// // //     if (payment.status === "REFUNDED") {
// // //       return res.status(400).json({ message: "Already refunded" });
// // //     }

// // //     // mark refunded
// // //     payment.status = "REFUNDED";
// // //     payment.deliveryStatus = "CANCELLED";
// // //     payment.cancellation = {
// // //       reason: "Refunded by admin",
// // //       cancelledAt: new Date(),
// // //     };

// // //     await payment.save();

// // //     res.json({
// // //       message: "Refund processed successfully",
// // //       status: "refunded",
// // //     });
// // //   } catch (err) {
// // //     console.error("refundPayment:", err);
// // //     res.status(500).json({ message: "Refund failed" });
// // //   }
// // // };



// // // controllers/adminPaymentController.js
// // const Transaction = require("../models/paymentModel"); // Transaction model
// // const { User } = require("../models/User"); // note: exports from your User.js
// // const mongoose = require("mongoose");

// // /**
// //  * Helper: find user + embedded order by transactionId
// //  * returns { user: { _id, username, email, phoneNumber }, order } or null
// //  */
// // async function findOrderByTransactionId(txnId) {
// //   if (!mongoose.Types.ObjectId.isValid(txnId)) return null;

// //   const user = await User.findOne(
// //     { "orders.transactionId": new mongoose.Types.ObjectId(txnId) },
// //     {
// //       "orders.$": 1,
// //       username: 1,
// //       email: 1,
// //       phoneNumber: 1,
// //     }
// //   ).lean();

// //   if (!user || !user.orders || !user.orders.length) return null;

// //   return {
// //     user: {
// //       _id: user._id,
// //       username: user.username,
// //       email: user.email,
// //       phoneNumber: user.phoneNumber,
// //     },
// //     order: user.orders[0],
// //   };
// // }


// // /* ============================
// //    GET /api/admin/payments
// //    returns list of transactions merged with order & user summary (if exists)
// //    ============================ */
// // exports.getAllPayments = async (req, res) => {
// //   try {
// //     const txns = await Transaction.find().sort({ createdAt: -1 }).lean();

// //     // attach embedded order/user info when available
// //     const merged = await Promise.all(
// //       txns.map(async (t) => {
// //         const match = await findOrderByTransactionId(t._id);
// //         if (match) {
// //           return { ...t, order: match.order, userSummary: match.user };
// //         }
// //         return { ...t, order: null, userSummary: null };
// //       })
// //     );

// //     res.json(merged);
// //   } catch (err) {
// //     console.error("getAllPayments:", err);
// //     res.status(500).json({ message: "Server error" });
// //   }
// // };

// // /* ============================
// //    GET /api/admin/payments/:id
// //    returns single txn merged with order & user summary
// //    ============================ */
// // exports.getPaymentById = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const txn = await Transaction.findById(id).lean();
// //     if (!txn) return res.status(404).json({ message: "Transaction not found" });

// //     const match = await findOrderByTransactionId(txn._id);
// //     const merged = match ? { ...txn, order: match.order, userSummary: match.user } : { ...txn, order: null, userSummary: null };
// //     res.json(merged);
// //   } catch (err) {
// //     console.error("getPaymentById:", err);
// //     res.status(500).json({ message: "Server error" });
// //   }
// // };

// // /* ============================
// //    PATCH /api/admin/payments/:id/status
// //    body: { status?, orderStatus?, deliveryStatus? }
// //    Updates transaction.status and/or embedded order fields (if order exists)
// //    ============================ */
// // exports.updatePaymentStatus = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const { status, orderStatus, deliveryStatus } = req.body;

// //     const updates = {};
// //     if (status) updates.status = status.toUpperCase();

// //     // update transaction
// //     const txn = await Transaction.findByIdAndUpdate(id, updates, { new: true }).lean();
// //     if (!txn) return res.status(404).json({ message: "Transaction not found" });

// //     // if order updates requested, update embedded subdocument inside User
// //     let updatedOrder = null;
// //     if (orderStatus || deliveryStatus) {
// //       // find user and the order index
// //       const userDoc = await User.findOne({ "orders.transactionId": txn._id });
// //       if (userDoc) {
// //         // update the exact order element using positional operator
// //         const setOps = {};
// //         if (orderStatus) setOps["orders.$.status"] = orderStatus.toUpperCase();
// //         if (deliveryStatus) setOps["orders.$.deliveryStatus"] = deliveryStatus.toUpperCase();

// //         await User.updateOne({ _id: userDoc._id, "orders.transactionId": txn._id }, { $set: setOps });
// //         const refreshed = await User.findOne({ _id: userDoc._id, "orders.transactionId": txn._id }, { "orders.$": 1 }).lean();
// //         updatedOrder = refreshed?.orders?.[0] || null;
// //       }
// //     }

// //     // return merged result
// //     const match = await findOrderByTransactionId(txn._id);
// //     res.json({ transaction: txn, order: updatedOrder || (match ? match.order : null), userSummary: match ? match.user : null });
// //   } catch (err) {
// //     console.error("updatePaymentStatus:", err);
// //     res.status(500).json({ message: "Server error" });
// //   }
// // };

// // /* ============================
// //    POST /api/admin/payments/:id/refund
// //    Performs refund (marks transaction REFUNDED) and marks order CANCELLED (if exists)
// //    ============================ */
// // exports.refundPayment = async (req, res) => {
// //   try {
// //     const { id } = req.params;

// //     const txn = await Transaction.findById(id);
// //     if (!txn) return res.status(404).json({ message: "Transaction not found" });

// //     // idempotent: if already refunded, return success
// //     if (txn.status === "REFUNDED") {
// //       const match = await findOrderByTransactionId(txn._id);
// //       return res.json({ transaction: txn.toObject(), order: match ? match.order : null, userSummary: match ? match.user : null });
// //     }

// //     // 1) Update transaction
// //     txn.status = "REFUNDED";
// //     await txn.save();

// //     // 2) Update order (if exists): mark CANCELLED + cancellation info
// //     const userDoc = await User.findOne({ "orders.transactionId": txn._id });
// //     if (userDoc) {
// //       await User.updateOne(
// //         { _id: userDoc._id, "orders.transactionId": txn._id },
// //         {
// //           $set: {
// //             "orders.$.status": "CANCELLED",
// //             "orders.$.deliveryStatus": "CANCELLED",
// //             "orders.$.cancellation.reason": "Refund processed by admin",
// //             "orders.$.cancellation.cancelledAt": new Date(),
// //           },
// //         }
// //       );
// //     }

// //     const match = await findOrderByTransactionId(txn._id);
// //     res.json({ transaction: txn.toObject(), order: match ? match.order : null, userSummary: match ? match.user : null });
// //   } catch (err) {
// //     console.error("refundPayment:", err);
// //     res.status(500).json({ message: "Server error" });
// //   }
// // };


// const Transaction = require("../models/paymentModel");
// const { User } = require("../models/User");
// const mongoose = require("mongoose");

// /**
//  * Helper: find user + embedded order by transactionId
//  */
// async function findOrderByTransactionId(txnId) {
//   if (!mongoose.Types.ObjectId.isValid(txnId)) return null;

//   const user = await User.findOne(
//     { "orders.transactionId": new mongoose.Types.ObjectId(txnId) },
//     {
//       "orders.$": 1,
//       username: 1,
//       email: 1,
//       phoneNumber: 1,
//     }
//   ).lean();

//   if (!user || !user.orders?.length) return null;

//   return {
//     user: {
//       _id: user._id,
//       username: user.username,
//       email: user.email,
//       phoneNumber: user.phoneNumber,
//     },
//     order: user.orders[0],
//   };
// }

// /* ============================
//    GET ALL PAYMENTS
// ============================ */
// exports.getAllPayments = async (req, res) => {
//   try {
//     const txns = await Transaction.find().sort({ createdAt: -1 }).lean();

//     const merged = await Promise.all(
//       txns.map(async (t) => {
//         const match = await findOrderByTransactionId(t._id);
//         return {
//           ...t,
//           order: match?.order || null,
//           userSummary: match?.user || null,
//         };
//       })
//     );

//     res.json(merged);
//   } catch (err) {
//     console.error("getAllPayments:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// /* ============================
//    GET PAYMENT BY ID
// ============================ */
// exports.getPaymentById = async (req, res) => {
//   try {
//     const txn = await Transaction.findById(req.params.id).lean();
//     if (!txn) return res.status(404).json({ message: "Transaction not found" });

//     const match = await findOrderByTransactionId(txn._id);

//     res.json({
//       ...txn,
//       order: match?.order || null,
//       userSummary: match?.user || null,
//     });
//   } catch (err) {
//     console.error("getPaymentById:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// /* ============================
//    UPDATE PAYMENT STATUS
// ============================ */
// exports.updatePaymentStatus = async (req, res) => {
//   try {
//     const { status } = req.body;

//     const txn = await Transaction.findByIdAndUpdate(
//       req.params.id,
//       { status: status?.toUpperCase() },
//       { new: true }
//     ).lean();

//     if (!txn) return res.status(404).json({ message: "Transaction not found" });

//     const match = await findOrderByTransactionId(txn._id);

//     res.json({
//       transaction: txn,
//       order: match?.order || null,
//       userSummary: match?.user || null,
//     });
//   } catch (err) {
//     console.error("updatePaymentStatus:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// /* ============================
//    🚚 UPDATE DELIVERY STATUS
// ============================ */
// exports.updateDeliveryStatus = async (req, res) => {
//   try {
//     const { deliveryStatus } = req.body;
//     const allowed = ["PENDING", "SHIPPED", "DELIVERED", "CANCELLED"];

//     if (!allowed.includes(deliveryStatus)) {
//       return res.status(400).json({ message: "Invalid delivery status" });
//     }

//     const txn = await Transaction.findById(req.params.id);
//     if (!txn) return res.status(404).json({ message: "Transaction not found" });

//     // Find embedded order
//     const userDoc = await User.findOne({ "orders.transactionId": txn._id });
//     if (!userDoc) {
//       return res.status(404).json({ message: "Order not found for this transaction" });
//     }

//     const order = userDoc.orders.find(
//       (o) => String(o.transactionId) === String(txn._id)
//     );

//     // Safety rules
//     if (order.deliveryStatus === "DELIVERED") {
//       return res.status(400).json({ message: "Delivered orders cannot be changed" });
//     }

//     if (order.status === "CANCELLED") {
//       return res.status(400).json({ message: "Cancelled orders cannot be updated" });
//     }

//     // Update delivery status
//     await User.updateOne(
//       { _id: userDoc._id, "orders.transactionId": txn._id },
//       {
//         $set: {
//           "orders.$.deliveryStatus": deliveryStatus,
//           ...(deliveryStatus === "DELIVERED" && {
//             "orders.$.status": "COMPLETED",
//           }),
//           ...(deliveryStatus === "CANCELLED" && {
//             "orders.$.status": "CANCELLED",
//             "orders.$.cancellation.reason": "Cancelled by admin",
//             "orders.$.cancellation.cancelledAt": new Date(),
//           }),
//         },
//       }
//     );

//     const match = await findOrderByTransactionId(txn._id);

//     res.json({
//       transaction: txn.toObject(),
//       order: match?.order || null,
//       userSummary: match?.user || null,
//     });
//   } catch (err) {
//     console.error("updateDeliveryStatus:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// /* ============================
//    REFUND PAYMENT
// ============================ */
// exports.refundPayment = async (req, res) => {
//   try {
//     const txn = await Transaction.findById(req.params.id);
//     if (!txn) return res.status(404).json({ message: "Transaction not found" });

//     if (txn.status === "REFUNDED") {
//       const match = await findOrderByTransactionId(txn._id);
//       return res.json({
//         transaction: txn.toObject(),
//         order: match?.order || null,
//         userSummary: match?.user || null,
//       });
//     }

//     txn.status = "REFUNDED";
//     await txn.save();

//     await User.updateOne(
//       { "orders.transactionId": txn._id },
//       {
//         $set: {
//           "orders.$.status": "CANCELLED",
//           "orders.$.deliveryStatus": "CANCELLED",
//           "orders.$.cancellation.reason": "Refund processed by admin",
//           "orders.$.cancellation.cancelledAt": new Date(),
//         },
//       }
//     );

//     const match = await findOrderByTransactionId(txn._id);

//     res.json({
//       transaction: txn.toObject(),
//       order: match?.order || null,
//       userSummary: match?.user || null,
//     });
//   } catch (err) {
//     console.error("refundPayment:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

const Transaction = require("../models/paymentModel");
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
  const { deliveryStatus } = req.body;
  if (!DELIVERY_STATUSES.includes(deliveryStatus))
    return res.status(400).json({ message: "Invalid delivery status" });

  const txn = await Transaction.findById(req.params.id);
  if (!txn) return res.status(404).json({ message: "Not found" });

  if (txn.deliveryStatus === "DELIVERED")
    return res.status(400).json({ message: "Delivered orders are locked" });

  txn.deliveryStatus = deliveryStatus;
  if (deliveryStatus === "DELIVERED") txn.status = "COMPLETED";
  if (deliveryStatus === "CANCELLED") txn.status = "CANCELLED";

  await txn.save();

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

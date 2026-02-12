/// file: Backend/routes/order.js
const express = require("express");
const jwt = require("jsonwebtoken");
const { User } = require("../models/User");
const Transaction = require("../models/paymentModel");
const Product = require("../models/Product");

const router = express.Router();

/* ==================== AUTH MIDDLEWARE ==================== */
const auth = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader)
      return res.status(401).json({ message: "No token provided" });

    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded._id;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

/* ==================== GET LOGGED-IN USER ORDERS ==================== */
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("orders");
    if (!user) return res.status(404).json({ message: "User not found" });

    const ordersWithTransaction = await Promise.all(
      user.orders.map(async (order) => {
        const transaction = await Transaction.findById(order.transactionId);

        const itemsWithProductInfo = await Promise.all(
          order.items.map(async (item) => {
            let product = null;

            try {
              product = await Product.findById(item.product);
            } catch (err) {
              console.warn(`Product not found: ${item.product}`);
            }

            return {
              _id: item._id,
              quantity: item.quantity,
              price: item.price,
              product: product
                ? {
                    _id: product._id,
                    name: product.name,
                    price: item.price, // snapshot price from order
                    image1: product.image1 || "",
                  }
                : {
                    _id: item.product,
                    name: item.name || "Product unavailable",
                    price: item.price,
                    image1: "",
                  },
            };
          })
        );

        return {
          orderId: order._id,
          purchasedAt: order.purchasedAt,
          status: order.status,
          totalAmount: order.totalAmount,
          paymentGateway: order.paymentGateway,
          deliveryAddress: order.deliveryAddress,
          items: itemsWithProductInfo,
          transaction: transaction
            ? {
                transactionId: transaction._id,
                status: transaction.status,
                paymentGateway: transaction.payment_gateway,
                deliveryStatus: transaction.deliveryStatus,
                amount: transaction.amount,
                cancellation: transaction.cancellation || null,
              }
            : null,
        };
      })
    );

    // Sort by latest order first
    ordersWithTransaction.sort(
      (a, b) => new Date(b.purchasedAt) - new Date(a.purchasedAt)
    );

    res.status(200).json(ordersWithTransaction);
  } catch (error) {
    console.error("GET /api/user/orders error:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

/* ==================== CANCEL ORDER ==================== */
router.post("/:orderId/cancel", auth, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;

    if (!reason || reason.trim() === "") {
      return res.status(400).json({ message: "Cancellation reason is required" });
    }

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const order = user.orders.find((o) => o._id.toString() === orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (!order.transactionId) {
      return res.status(400).json({ message: "Order has no transaction" });
    }

    const transaction = await Transaction.findById(order.transactionId);
    if (!transaction) return res.status(404).json({ message: "Transaction not found" });

    if (transaction.status !== "PENDING" && transaction.deliveryStatus !== "PENDING") {
      return res.status(400).json({ message: "Only pending orders can be cancelled" });
    }

    // Update transaction
    transaction.status = "CANCELLED";
    transaction.deliveryStatus = "CANCELLED";
    transaction.cancellation = { reason, cancelledAt: new Date() };
    await transaction.save();

    // Update order in user
    order.status = "CANCELLED";
    order.deliveryStatus = "CANCELLED";
    order.cancellation = { reason, cancelledAt: new Date() };
    await user.save();

    res.json({ message: "Order cancelled successfully" });
  } catch (err) {
    console.error("POST /api/user/orders/:orderId/cancel error:", err);
    res.status(500).json({ message: "Failed to cancel order" });
  }
});



module.exports = router;

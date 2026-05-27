console.log("🔍 Environment check:", {
  hasEsewaId: !!process.env.ESEWA_MERCHANT_ID,
  hasEsewaSecret: !!process.env.ESEWA_SECRET,
  hasEsewaUrl: !!process.env.ESEWA_PAYMENT_URL,
  hasKhaltiKey: !!process.env.KHALTI_SECRET_KEY,
  hasUrls: !!process.env.SUCCESS_URL && !!process.env.FAILURE_URL,
});

const { randomUUID } = require("crypto");
const mongoose = require("mongoose");
const Transaction = require("../models/paymentModel");
const Product = require("../models/Product");
const { User } = require("../models/User");
const { generateHmacSha256Hash } = require("../utils/helper");
const axios = require("axios");
const qs = require("querystring");
const nodemailer = require("nodemailer");
const sendNotification = require("../utils/sendNotification");

{/* Email transporter configuration */}
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

{/* SMTP verification */}
transporter.verify((err) => {
  if (err) console.error("❌ SMTP ERROR:", err);
  else console.log("✅ SMTP READY");
});

function getProductId(item) {
  return item?.productId || item?.product || item?._id || null;
}

function getQuantity(item) {
  const qty = Number(item?.quantity || 0);
  return Number.isFinite(qty) ? qty : 0;
}
///this fucntion
async function validateCartStock(cartItems = []) {
  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    throw new Error("Cart is empty");
  }

  for (const item of cartItems) {
    const prodId = getProductId(item);
    const qty = getQuantity(item);

    if (!prodId || qty <= 0) {
      throw new Error("Invalid cart item detected");
    }

    const product = await Product.findById(prodId);
    if (!product) {
      throw new Error(`Product not found: ${prodId}`);
    }

    if (product.stock < qty) {
      throw new Error(
        `Insufficient stock for ${product.name}. Available: ${product.stock}, requested: ${qty}`
      );
    }
  }
}

function buildOrderData(transaction) {
  const cartItems = transaction.cartItems || [];

  return {
    transactionId: transaction._id,
    items: cartItems.map((item) => ({
      product: item.productId,
      quantity: Number(item.quantity || 0),
      price: Number(item.price || 0),
      name: item.name,
    })),
    totalAmount: transaction.amount,
    paymentGateway: transaction.payment_gateway,
    status: "COMPLETED",
    deliveryStatus: "PENDING",
    deliveryAddress: transaction.deliveryAddress,
    purchasedAt: new Date(),
  };
}

async function sendTransactionEmail(transaction, type = "PAID") {
  try {
    const emailFlag = type === "COD_PLACED" ? "codEmailSent" : "emailSent";
    const guard = await Transaction.findOneAndUpdate(
      { _id: transaction._id, [emailFlag]: { $ne: true } },
      { $set: { [emailFlag]: true } },
      { new: true }
    );

    if (!guard)
      return console.log(`✉️ Email (${emailFlag}) already sent or missing.`);

    const toEmail =
      (transaction.customerDetails && transaction.customerDetails.email) ||
      transaction.customerEmail ||
      null;

    if (!toEmail)
      return console.log("✉️ No customer email found, skipping email.");

    let formattedAddress = "Not provided";
    if (
      transaction.deliveryAddress &&
      typeof transaction.deliveryAddress === "object"
    ) {
      const addr = transaction.deliveryAddress;
      formattedAddress = [
        addr.label,
        addr.street,
        addr.city,
        addr.state,
        addr.postalCode,
        addr.country,
      ]
        .filter(Boolean)
        .join("<br>");
    } else if (typeof transaction.deliveryAddress === "string") {
      formattedAddress = transaction.deliveryAddress;
    }

    const itemsHtml = (transaction.cartItems || [])
      .map(
        (it) =>
          `<tr>
             <td style="padding:6px 10px;border:1px solid #eee">${it.name || it.productId}</td>
             <td style="padding:6px 10px;border:1px solid #eee;text-align:center">${it.quantity || 0}</td>
             <td style="padding:6px 10px;border:1px solid #eee;text-align:right">${it.price != null ? it.price : "-"}</td>
           </tr>`
      )
      .join("");

    const totalAmount = Number(transaction.amount) || 0;
    let subtotal = 0;
    let taxAmount = 0;
    let deliveryCharge = 0;

    const possibleSubtotalFree = totalAmount / 1.13;
    if (possibleSubtotalFree > 3000) {
      subtotal = possibleSubtotalFree;
      deliveryCharge = 0;
    } else {
      subtotal = (totalAmount - 100) / 1.13;
      deliveryCharge = 100;
    }

    subtotal = Math.round(subtotal);
    taxAmount = Math.round(subtotal * 0.13);

    const subject =
      type === "COD_PLACED"
        ? `FloraVerse | COD Order Placed — ${transaction._id}`
        : `FloraVerse | Order Confirmation — ${transaction._id}`;

    const intro =
      type === "COD_PLACED"
        ? "We've received your Cash on Delivery order. Payment will be collected on delivery."
        : "We've received your payment successfully. Here are the details of your purchase:";

    const html = `
      <div style="font-family: Arial, sans-serif; line-height:1.4; color:#222; padding:18px">
        <h2 style="color:#2e7d32; margin-bottom:0.2rem">${
          type === "COD_PLACED"
            ? "Order Placed (Cash on Delivery)"
            : "Thank you for your order!"
        }</h2>
        <p style="margin-top:6px">Hi ${transaction.customerDetails?.name || "Customer"},</p>
        <p>${intro}</p>
        <h3 style="margin-bottom:6px">Order Summary</h3>
        <table style="border-collapse:collapse; width:100%; max-width:700px">
          <thead>
            <tr>
              <th style="padding:8px 10px;border:1px solid #eee;text-align:left">Product</th>
              <th style="padding:8px 10px;border:1px solid #eee;text-align:center">Qty</th>
              <th style="padding:8px 10px;border:1px solid #eee;text-align:right">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml || '<tr><td colspan="3" style="padding:10px">No items</td></tr>'}
            <tr>
              <td colspan="2" style="padding:8px 10px;border:1px solid #eee;text-align:right">Subtotal</td>
              <td style="padding:8px 10px;border:1px solid #eee;text-align:right">${subtotal}</td>
            </tr>
            <tr>
              <td colspan="2" style="padding:8px 10px;border:1px solid #eee;text-align:right">Tax</td>
              <td style="padding:8px 10px;border:1px solid #eee;text-align:right">${taxAmount}</td>
            </tr>
            <tr>
              <td colspan="2" style="padding:8px 10px;border:1px solid #eee;text-align:right">Delivery Charge</td>
              <td style="padding:8px 10px;border:1px solid #eee;text-align:right">${deliveryCharge}</td>
            </tr>
            <tr>
              <td colspan="2" style="padding:8px 10px;border:1px solid #eee;text-align:right"><strong>Total</strong></td>
              <td style="padding:8px 10px;border:1px solid #eee;text-align:right"><strong>${transaction.amount}</strong></td>
            </tr>
          </tbody>
        </table>
        <p style="margin-top:12px"><strong>Transaction ID:</strong> ${transaction._id}</p>
        <p><strong>Payment Gateway:</strong> ${transaction.payment_gateway || "N/A"}</p>
        <h4 style="margin-bottom:6px">Delivery Address</h4>
        <p style="margin-top:0">${formattedAddress}</p>
        <p style="font-size:0.95rem;color:#555">If you have any questions, reply to this email or contact our support.</p>
        <hr style="border:none;border-top:1px solid #eee;margin:12px 0" />
        <p style="font-size:0.85rem;color:#666">FloraVerse — Order confirmation</p>
      </div>
    `;

    await transporter.sendMail({
      from: `"FloraVerse Team" <${process.env.EMAIL}>`,
      to: toEmail,
      subject,
      html,
    });

    console.log(
      `✉️ Order email (${emailFlag}) sent for transaction:`,
      transaction._id
    );
  } catch (err) {
    console.error("❌ Failed to send transaction email:", err);
  }
}

async function postPaymentProcessing(transaction) {
  try {
    const freshTransaction = await Transaction.findOne({
      _id: transaction._id,
      stockUpdated: { $ne: true },
    });

    if (!freshTransaction) {
      console.log("⏭️ Transaction already processed");
      return;
    }

    const cartItems = freshTransaction.cartItems || [];

    if (!cartItems.length) {
      throw new Error("No cart items found");
    }

    // Validate stock first
    for (const item of cartItems) {
      const prodId = getProductId(item);
      const qty = getQuantity(item);

      const product = await Product.findById(prodId);

      if (!product) {
        throw new Error(`Product not found: ${prodId}`);
      }

      if (product.stock < qty) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }
    }

    // Deduct stock
    for (const item of cartItems) {
      const prodId = getProductId(item);
      const qty = getQuantity(item);

      const updatedProduct = await Product.findOneAndUpdate(
        { _id: prodId, stock: { $gte: qty } },
        { $inc: { stock: -qty } },
        { new: true }
      );

      if (!updatedProduct) {
        throw new Error(`Failed updating stock for ${prodId}`);
      }
    }

    // Mark transaction processed
    await Transaction.updateOne(
      { _id: freshTransaction._id },
      { $set: { stockUpdated: true, deliveryStatus: "PENDING" } }
    );

    const orderData = buildOrderData(freshTransaction);

    const purchasedIds = cartItems.map((i) => i.productId).filter(Boolean);

    await User.findOneAndUpdate(
      {
        _id: freshTransaction.user,
        "orders.transactionId": { $ne: freshTransaction._id },
      },
      {
        $pull: { cart: { product: { $in: purchasedIds } } },
        $push: { orders: orderData },
      }
    );

    console.log("✅ postPaymentProcessing completed:", transaction._id);
  } catch (err) {
    console.error("❌ Post payment processing error:", err);
    throw err;
  }
}

// ─────────────────────────────────────────────
// INITIATE PAYMENT (eSewa / Khalti)
// ─────────────────────────────────────────────
const initiatePayment = async (req, res) => {
  const {
    amount,
    cartItems,
    paymentGateway,
    customerName,
    customerEmail,
    customerPhone,
    deliveryAddress,
  } = req.body;

  if (!paymentGateway || !cartItems || !deliveryAddress) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  if (!cartItems.length) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  const safeAmount = Math.round(Number(amount) || 0);

  try {
    await validateCartStock(cartItems);

    const transaction = await Transaction.create({
      user: req.user._id,
      customerDetails: {
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
      },
      cartItems,
      amount: safeAmount,
      payment_gateway: paymentGateway,
      status: "PENDING",
      deliveryStatus: "PENDING",
      deliveryAddress,
      stockUpdated: false,
    });

    console.log("✅ Transaction created:", transaction._id.toString());

    // ── eSewa ──────────────────────────────────────────────────────────────
    if (paymentGateway === "esewa") {
      // Generate a fresh UUID on every attempt so eSewa never sees a
      // duplicate transaction_uuid — this prevents the 409 Conflict that
      // occurs when a previous session with the same UUID is still alive
      // on eSewa's server.
      const esewaUUID = randomUUID();

      // Persist it so the success callback can find the right transaction
      transaction.esewaTransactionUUID = esewaUUID;
      await transaction.save();

      const paymentData = {
        amount: safeAmount.toString(),
        tax_amount: "0",
        total_amount: safeAmount.toString(),
        transaction_uuid: esewaUUID,           // ← fresh UUID, NOT _id
        product_code: process.env.ESEWA_MERCHANT_ID,
        product_service_charge: "0",
        product_delivery_charge: "0",
        success_url: process.env.SUCCESS_URL,
        failure_url: process.env.FAILURE_URL,
        signed_field_names: "total_amount,transaction_uuid,product_code",
      };

      const dataToSign = `total_amount=${paymentData.total_amount},transaction_uuid=${esewaUUID},product_code=${paymentData.product_code}`;
      paymentData.signature = generateHmacSha256Hash(
        dataToSign,
        process.env.ESEWA_SECRET
      );

      console.log("━━━━━━━━━━━━ eSewa DEBUG ━━━━━━━━━━━━");
      console.log("esewaUUID    :", esewaUUID);
      console.log("dataToSign   :", dataToSign);
      console.log("signature    :", paymentData.signature);
      console.log("success_url  :", paymentData.success_url);
      console.log("failure_url  :", paymentData.failure_url);
      console.log("total_amount :", paymentData.total_amount);
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

      // Return params to frontend — browser will POST directly to eSewa
      return res.json({
        transactionId: transaction._id,   // stored in sessionStorage on frontend
        esewaUrl: process.env.ESEWA_PAYMENT_URL,
        esewaParams: paymentData,
      });
    }

    // ── Khalti ─────────────────────────────────────────────────────────────
    if (paymentGateway === "khalti") {
      const khaltiPayload = {
        return_url: process.env.SUCCESS_URL,
        website_url: "http://localhost:5173",
        amount: safeAmount * 100,
        purchase_order_id: transaction._id.toString(),
        purchase_order_name: cartItems
          .map((i) => i.name)
          .join(", ")
          .substring(0, 100),
        customer_info: {
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
        },
      };

      const payment = await axios.post(
        process.env.KHALTI_PAYMENT_URL,
        khaltiPayload,
        {
          headers: {
            Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!payment.data?.payment_url) {
        throw new Error("Payment URL missing from Khalti");
      }

      return res.json({
        url: payment.data.payment_url,
        transactionId: transaction._id,
      });
    }

    return res.status(400).json({ message: "Invalid payment gateway" });
  } catch (error) {
    console.error("❌ Payment initiation error:", error.message || error);
    return res.status(500).json({
      message: "Payment initiation failed",
      error: error.message || error,
    });
  }
};

// ─────────────────────────────────────────────
// CASH ON DELIVERY
// ─────────────────────────────────────────────
const initiateCashOnDeliveryPayment = async (req, res) => {
  try {
    const {
      amount,
      cartItems,
      customerName,
      customerEmail,
      customerPhone,
      deliveryAddress,
    } = req.body;

    if (!cartItems || !deliveryAddress) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!cartItems.length) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const safeAmount = Math.round(Number(amount) || 0);

    await validateCartStock(cartItems);

    const transaction = await Transaction.create({
      user: req.user._id,
      customerDetails: {
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
      },
      cartItems,
      amount: safeAmount,
      payment_gateway: "cod",
      status: "PENDING",
      deliveryStatus: "PENDING",
      deliveryAddress,
      stockUpdated: false,
    });

    console.log("✅ COD Transaction created:", transaction._id.toString());

    await postPaymentProcessing(transaction);

    console.log(
      "✅ COD order saved and stock deducted for:",
      transaction._id.toString()
    );

    try {
      await sendNotification({
        user: transaction.user,
        title: "Order Placed (Cash on Delivery)",
        message: `Your COD order #${transaction._id} has been placed successfully. Total: Rs. ${transaction.amount}. Payment will be collected on delivery.`,
        type: "order_confirmed",
        link: `/orders/${transaction._id}`,
      });
    } catch (e) {
      console.error("❌ COD placed notification error:", e);
    }

    try {
      await sendTransactionEmail(transaction, "COD_PLACED");
    } catch (e) {
      console.error("❌ COD placed email error:", e);
    }

    return res.json({
      transactionId: transaction._id,
      message: "Order placed successfully (Cash on Delivery)",
    });
  } catch (err) {
    console.error("❌ COD initiation error:", err);
    return res.status(500).json({
      message: "COD initiation failed",
      error: err.message || err,
    });
  }
};

// ─────────────────────────────────────────────
// MARK COD AS PAID
// ─────────────────────────────────────────────
const markCodPaid = async (req, res) => {
  try {
    const transactionId = req.params.transactionId || req.body.transactionId;
    if (!transactionId) {
      return res.status(400).json({ message: "transactionId is required" });
    }

    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (transaction.payment_gateway !== "cod") {
      return res
        .status(400)
        .json({ message: "Not a Cash-on-Delivery transaction" });
    }

    if (transaction.status !== "COMPLETED") {
      transaction.status = "COMPLETED";
      transaction.deliveryStatus = transaction.deliveryStatus || "PENDING";
      await transaction.save();
    }

    console.log(
      "✅ COD marked as paid (or already paid):",
      transaction._id.toString()
    );

    try {
      await postPaymentProcessing(transaction);
    } catch (ppErr) {
      console.error("❌ postPaymentProcessing failed for COD:", ppErr);
    }

    try {
      await sendNotification({
        user: transaction.user,
        title: "Payment Received",
        message: `Payment for your COD order #${transaction._id} has been confirmed. Total: Rs. ${transaction.amount}.`,
        type: "payment_success",
        link: `/orders/${transaction._id}`,
      });
    } catch (e) {
      console.error("❌ COD paid notification error:", e);
    }

    try {
      await sendTransactionEmail(transaction, "PAID");
    } catch (emailErr) {
      console.error("❌ sendTransactionEmail failed for COD:", emailErr);
    }

    return res.json({ status: "COMPLETED", transactionId: transaction._id });
  } catch (err) {
    console.error("❌ markCodPaid error:", err);
    return res.status(500).json({
      message: "Failed to mark COD as paid",
      error: err.message || err,
    });
  }
};

// ─────────────────────────────────────────────
// PAYMENT STATUS (eSewa / Khalti callback)
// ─────────────────────────────────────────────
const paymentStatus = async (req, res) => {
  const { transactionId, status, pidx } = req.body;

  if (!transactionId) {
    return res.status(400).json({ message: "transactionId is required" });
  }

  try {
    // transactionId from sessionStorage is always the MongoDB _id
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(400).json({ message: "Transaction not found" });
    }

    // ── PAYMENT FAILED ───────────────────────────────────────
    if (status === "FAILED") {
      transaction.status = "FAILED";
      await transaction.save();

      try {
        await sendNotification({
          user: transaction.user,
          title: "Payment Failed",
          message: `Your payment of Rs. ${transaction.amount} via ${transaction.payment_gateway?.toUpperCase()} could not be processed. Please try again.`,
          type: "payment_success",
          link: `/orders`,
        });
      } catch (e) {
        console.error("❌ Payment failed notification error:", e);
      }

      return res.json({ status: "FAILED" });
    }

    // ── eSewa ────────────────────────────────────────────────
    if (transaction.payment_gateway === "esewa") {
      // Use the stored esewaTransactionUUID for the status check —
      // this must match what was sent to eSewa during initiation
      const uuidForCheck =
        transaction.esewaTransactionUUID || transaction._id.toString();

      try {
        const response = await axios.get(
          process.env.ESEWA_PAYMENT_STATUS_CHECK_URL,
          {
            params: {
              product_code: process.env.ESEWA_MERCHANT_ID,
              total_amount: transaction.amount,
              transaction_uuid: uuidForCheck,   // ← use stored UUID
            },
          }
        );

        console.log("🔍 eSewa status check response:", response.data);

        if (response.data && response.data.status === "COMPLETE") {
          transaction.status = "COMPLETED";
          transaction.deliveryStatus = "PENDING";
          await transaction.save();

          await postPaymentProcessing(transaction);
          await sendTransactionEmail(transaction, "PAID");

          try {
            await sendNotification({
              user: transaction.user,
              title: "Payment Successful",
              message: `Your payment of Rs. ${transaction.amount} via eSewa was successful. Your order #${transaction._id} is confirmed!`,
              type: "payment_success",
              link: `/orders/${transaction._id}`,
            });
          } catch (e) {
            console.error("❌ eSewa success notification error:", e);
          }

          return res.json({ status: "COMPLETED" });
        }
      } catch (e) {
        console.error("❌ eSewa status check error:", e.message || e);
      }
    }

    // ── Khalti ───────────────────────────────────────────────
    if (transaction.payment_gateway === "khalti") {
      if (!pidx) {
        return res
          .status(400)
          .json({ message: "pidx is required for Khalti" });
      }

      try {
        const response = await axios.post(
          process.env.KHALTI_VERIFICATION_URL,
          { pidx },
          {
            headers: {
              Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("🔍 Khalti verification response:", response.data);

        if (response.data && response.data.status === "Completed") {
          transaction.status = "COMPLETED";
          transaction.deliveryStatus = "PENDING";
          await transaction.save();

          await postPaymentProcessing(transaction);
          await sendTransactionEmail(transaction, "PAID");

          try {
            await sendNotification({
              user: transaction.user,
              title: "Payment Successful",
              message: `Your payment of Rs. ${transaction.amount} via Khalti was successful. Your order #${transaction._id} is confirmed!`,
              type: "payment_success",
              link: `/orders/${transaction._id}`,
            });
          } catch (e) {
            console.error("❌ Khalti success notification error:", e);
          }

          return res.json({ status: "COMPLETED" });
        }
      } catch (e) {
        console.error("❌ Khalti verification error:", e.message || e);
      }
    }

    // ── FALLTHROUGH FAILED ───────────────────────────────────
    transaction.status = "FAILED";
    await transaction.save();

    try {
      await sendNotification({
        user: transaction.user,
        title: "Payment Failed",
        message: `Your payment of Rs. ${transaction.amount} via ${transaction.payment_gateway?.toUpperCase()} could not be verified. Please contact support.`,
        type: "payment_success",
        link: `/orders`,
      });
    } catch (e) {
      console.error("❌ Fallthrough failed notification error:", e);
    }

    return res.json({ status: "FAILED" });
  } catch (err) {
    console.error("❌ Payment status error:", err.message || err);
    return res.status(500).json({
      message: "Payment status check failed",
      error: err.message || err,
    });
  }
};

module.exports = {
  initiatePayment,
  paymentStatus,
  initiateCashOnDeliveryPayment,
  markCodPaid,
};
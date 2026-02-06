// // // const Transaction = require("../models/paymentModel");
// // // const { generateHmacSha256Hash } = require("../utils/helper");
// // // const axios = require("axios");
// // // const qs = require("querystring"); // for eSewa

// // // // ===============================
// // // // INITIATE PAYMENT
// // // // ===============================
// // // const initiatePayment = async (req, res) => {
// // //   const {
// // //     amount,
// // //     cartItems,
// // //     paymentGateway,
// // //     customerName,
// // //     customerEmail,
// // //     customerPhone,
// // //     deliveryAddress,
// // //   } = req.body;

// // //   // ----------- VALIDATION -------------
// // //   if (!paymentGateway || !cartItems || !deliveryAddress) {
// // //     return res.status(400).json({ message: "Missing required fields" });
// // //   }

// // //   if (!cartItems.length) {
// // //     return res.status(400).json({ message: "Cart is empty" });
// // //   }

// // //   try {
// // //     // 1️⃣ Save transaction in DB
// // //     const transaction = await Transaction.create({
// // //       user: req.user._id,
// // //       customerDetails: {
// // //         name: customerName,
// // //         email: customerEmail,
// // //         phone: customerPhone,
// // //       },
// // //       cartItems,       // store array of items
// // //       amount,
// // //       payment_gateway: paymentGateway,
// // //       status: "PENDING",
// // //       deliveryAddress,
// // //     });

// // //     console.log("✅ Transaction created:", transaction._id.toString());

// // //     // ===============================
// // //     // ESEWA PAYMENT
// // //     // ===============================
// // //     if (paymentGateway === "esewa") {
// // //       const paymentData = {
// // //         amount: amount.toString(),
// // //         tax_amount: "0",
// // //         total_amount: amount.toString(),
// // //         transaction_uuid: transaction._id.toString(),
// // //         product_code: process.env.ESEWA_MERCHANT_ID,
// // //         product_service_charge: "0",
// // //         product_delivery_charge: "0",
// // //         success_url: process.env.SUCCESS_URL,
// // //         failure_url: process.env.FAILURE_URL,
// // //         signed_field_names: "total_amount,transaction_uuid,product_code",
// // //       };

// // //       const dataToSign = `total_amount=${paymentData.total_amount},transaction_uuid=${paymentData.transaction_uuid},product_code=${paymentData.product_code}`;
// // //       paymentData.signature = generateHmacSha256Hash(
// // //         dataToSign,
// // //         process.env.ESEWA_SECRET
// // //       );

// // //       const payment = await axios.post(
// // //         process.env.ESEWA_PAYMENT_URL,
// // //         qs.stringify(paymentData),
// // //         {
// // //           headers: { "Content-Type": "application/x-www-form-urlencoded" },
// // //           maxRedirects: 0,
// // //           validateStatus: (status) => status >= 200 && status < 400,
// // //         }
// // //       );

// // //       const paymentUrl = payment.headers?.location || payment.request?.res?.responseUrl;

// // //       if (!paymentUrl) throw new Error("Payment URL missing from eSewa");

// // //       return res.json({ url: paymentUrl, transactionId: transaction._id });
// // //     }

// // //     // ===============================
// // //     // KHALTI PAYMENT
// // //     // ===============================
// // //     if (paymentGateway === "khalti") {
// // //       const payment = await axios.post(
// // //         process.env.KHALTI_PAYMENT_URL,
// // //         {
// // //           amount: amount * 100, // paisa
// // //           mobile: customerPhone,
// // //           product_identity: transaction._id.toString(),
// // //           product_name: cartItems.map((i) => i.name).join(", "),
// // //           return_url: process.env.SUCCESS_URL,
// // //           failure_url: process.env.FAILURE_URL,
// // //           purchase_order_id: transaction._id.toString(),
// // //           purchase_order_name: cartItems.map((i) => i.name).join(", "),
// // //           website_url: "http://localhost:5173",
// // //         },
// // //         {
// // //           headers: {
// // //             Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
// // //             "Content-Type": "application/json",
// // //           },
// // //         }
// // //       );

// // //       const paymentUrl = payment.data?.payment_url;
// // //       if (!paymentUrl) throw new Error("Payment URL missing from Khalti");

// // //       return res.json({ url: paymentUrl, transactionId: transaction._id });
// // //     }

// // //     return res.status(400).json({ message: "Invalid payment gateway" });
// // //   } catch (error) {
// // //     console.error("❌ Payment initiation error:", error.message);
// // //     return res.status(500).json({
// // //       message: "Payment initiation failed",
// // //       error: error.message,
// // //     });
// // //   }
// // // };

// // // // ===============================
// // // // PAYMENT STATUS CHECK
// // // // ===============================
// // // const paymentStatus = async (req, res) => {
// // //   const { transactionId, status, pidx } = req.body;

// // //   // 1️⃣ Validate input
// // //   if (!transactionId) {
// // //     return res.status(400).json({ message: "transactionId is required" });
// // //   }

// // //   try {
// // //     const transaction = await Transaction.findById(transactionId);
// // //     if (!transaction)
// // //       return res.status(400).json({ message: "Transaction not found" });

// // //     // 2️⃣ Handle client-reported failure
// // //     if (status === "FAILED") {
// // //       transaction.status = "FAILED";
// // //       await transaction.save();
// // //       return res.json({
// // //         message: "FAILED",
// // //         status: "FAILED",
// // //         deliveryAddress: transaction.deliveryAddress,
// // //       });
// // //     }

// // //     // 3️⃣ ESEWA payment status check
// // //     if (transaction.payment_gateway === "esewa") {
// // //       const response = await axios.get(process.env.ESEWA_PAYMENT_STATUS_CHECK_URL, {
// // //         params: {
// // //           product_code: process.env.ESEWA_MERCHANT_ID,
// // //           total_amount: transaction.amount,
// // //           transaction_uuid: transaction._id.toString(),
// // //         },
// // //       });

// // //       if (response.data.status === "COMPLETE") {
// // //         transaction.status = "COMPLETED";
// // //         await transaction.save();
// // //         return res.json({
// // //           message: "COMPLETED",
// // //           status: "COMPLETED",
// // //           deliveryAddress: transaction.deliveryAddress,
// // //         });
// // //       }
// // //     }

// // //     // 4️⃣ Khalti payment status check
// // //     if (transaction.payment_gateway === "khalti") {
// // //       if (!pidx) {
// // //         return res
// // //           .status(400)
// // //           .json({ message: "pidx is required for Khalti verification" });
// // //       }

// // //       const response = await axios.post(
// // //         process.env.KHALTI_VERIFICATION_URL,
// // //         { pidx },
// // //         {
// // //           headers: {
// // //             Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
// // //             "Content-Type": "application/json",
// // //           },
// // //         }
// // //       );

// // //       if (response.data.status === "Completed") {
// // //         transaction.status = "COMPLETED";
// // //         await transaction.save();
// // //         return res.json({
// // //           message: "COMPLETED",
// // //           status: "COMPLETED",
// // //           deliveryAddress: transaction.deliveryAddress,
// // //         });
// // //       }
// // //     }

// // //     // 5️⃣ Fallback = FAILED
// // //     transaction.status = "FAILED";
// // //     await transaction.save();
// // //     return res.json({
// // //       message: "FAILED",
// // //       status: "FAILED",
// // //       deliveryAddress: transaction.deliveryAddress,
// // //     });
// // //   } catch (err) {
// // //     console.error("❌ Payment status error:", err.message);
// // //     return res.status(500).json({
// // //       message: "Payment status check failed",
// // //       error: err.message,
// // //     });
// // //   }
// // // };


// // // module.exports = { initiatePayment, paymentStatus };


// // // controllers/paymentController.js
// // const Transaction = require("../models/paymentModel");
// // const Product = require("../models/Product");
// // const { User } = require("../models/User");
// // const { generateHmacSha256Hash } = require("../utils/helper");
// // const axios = require("axios");
// // const qs = require("querystring"); // for eSewa

// // // Helper: post-payment processing (deduct stock + clear purchased items from user's cart)
// // async function postPaymentProcessing(transaction) {
// //   try {
// //     // If already processed, skip
// //     if (transaction.stockUpdated) return;

// //     const cartItems = transaction.cartItems || [];
// //     if (!cartItems.length) return;

// //     // 1) Decrease product stock for each item
// //     for (const item of cartItems) {
// //       const prodId = item.productId;
// //       const qty = Number(item.quantity || 0);
// //       if (!prodId || qty <= 0) continue;

// //       const product = await Product.findById(prodId);
// //       if (!product) {
// //         console.warn(`Product not found while updating stock: ${prodId}`);
// //         continue;
// //       }

// //       product.stock = Math.max(product.stock - qty, 0);
// //       await product.save();
// //     }

// //     // 2) Remove purchased items from user's cart (only those product IDs)
// //     const user = await User.findById(transaction.user);
// //     if (user) {
// //       const purchasedIds = new Set(cartItems.map((i) => i.productId.toString()));
// //       user.cart = (user.cart || []).filter(
// //         (ci) => !purchasedIds.has(ci.product.toString())
// //       );
// //       await user.save();
// //     }

// //     // 3) Mark transaction as processed for stock
// //     transaction.stockUpdated = true;
// //     await transaction.save();
// //   } catch (err) {
// //     console.error("Error in postPaymentProcessing:", err);
// //     // do not throw — we don't want the caller to fail the HTTP response if this fails,
// //     // but log it so you can inspect and retry if necessary.
// //   }
// // }

// // // ===============================
// // // INITIATE PAYMENT
// // // ===============================
// // const initiatePayment = async (req, res) => {
// //   const {
// //     amount,
// //     cartItems,
// //     paymentGateway,
// //     customerName,
// //     customerEmail,
// //     customerPhone,
// //     deliveryAddress,
// //   } = req.body;

// //   // ----------- VALIDATION -------------
// //   if (!paymentGateway || !cartItems || !deliveryAddress) {
// //     return res.status(400).json({ message: "Missing required fields" });
// //   }

// //   if (!cartItems.length) {
// //     return res.status(400).json({ message: "Cart is empty" });
// //   }

// //   try {
// //     // Save transaction in DB
// //     const transaction = await Transaction.create({
// //       user: req.user._id,
// //       customerDetails: {
// //         name: customerName,
// //         email: customerEmail,
// //         phone: customerPhone,
// //       },
// //       cartItems,
// //       amount,
// //       payment_gateway: paymentGateway,
// //       status: "PENDING",
// //       deliveryAddress,
// //     });

// //     console.log("✅ Transaction created:", transaction._id.toString());

// //     // ===============================
// //     // ESEWA PAYMENT
// //     // ===============================
// //     if (paymentGateway === "esewa") {
// //       const paymentData = {
// //         amount: amount.toString(),
// //         tax_amount: "0",
// //         total_amount: amount.toString(),
// //         transaction_uuid: transaction._id.toString(),
// //         product_code: process.env.ESEWA_MERCHANT_ID,
// //         product_service_charge: "0",
// //         product_delivery_charge: "0",
// //         success_url: process.env.SUCCESS_URL,
// //         failure_url: process.env.FAILURE_URL,
// //         signed_field_names: "total_amount,transaction_uuid,product_code",
// //       };

// //       const dataToSign = `total_amount=${paymentData.total_amount},transaction_uuid=${paymentData.transaction_uuid},product_code=${paymentData.product_code}`;
// //       paymentData.signature = generateHmacSha256Hash(
// //         dataToSign,
// //         process.env.ESEWA_SECRET
// //       );

// //       const payment = await axios.post(
// //         process.env.ESEWA_PAYMENT_URL,
// //         qs.stringify(paymentData),
// //         {
// //           headers: { "Content-Type": "application/x-www-form-urlencoded" },
// //           maxRedirects: 0,
// //           validateStatus: (status) => status >= 200 && status < 400,
// //         }
// //       );

// //       const paymentUrl = payment.headers?.location || payment.request?.res?.responseUrl;

// //       if (!paymentUrl) throw new Error("Payment URL missing from eSewa");

// //       return res.json({ url: paymentUrl, transactionId: transaction._id });
// //     }

// //     // ===============================
// //     // KHALTI PAYMENT
// //     // ===============================
// //     if (paymentGateway === "khalti") {
// //       const payment = await axios.post(
// //         process.env.KHALTI_PAYMENT_URL,
// //         {
// //           amount: amount * 100, // paisa
// //           mobile: customerPhone,
// //           product_identity: transaction._id.toString(),
// //           product_name: cartItems.map((i) => i.name).join(", "),
// //           return_url: process.env.SUCCESS_URL,
// //           failure_url: process.env.FAILURE_URL,
// //           purchase_order_id: transaction._id.toString(),
// //           purchase_order_name: cartItems.map((i) => i.name).join(", "),
// //           website_url: "http://localhost:5173",
// //         },
// //         {
// //           headers: {
// //             Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
// //             "Content-Type": "application/json",
// //           },
// //         }
// //       );

// //       const paymentUrl = payment.data?.payment_url;
// //       if (!paymentUrl) throw new Error("Payment URL missing from Khalti");

// //       return res.json({ url: paymentUrl, transactionId: transaction._id });
// //     }

// //     return res.status(400).json({ message: "Invalid payment gateway" });
// //   } catch (error) {
// //     console.error("❌ Payment initiation error:", error.message);
// //     return res.status(500).json({
// //       message: "Payment initiation failed",
// //       error: error.message,
// //     });
// //   }
// // };

// // // ===============================
// // // PAYMENT STATUS CHECK
// // // ===============================
// // const paymentStatus = async (req, res) => {
// //   const { transactionId, status, pidx } = req.body;

// //   // 1️⃣ Validate input
// //   if (!transactionId) {
// //     return res.status(400).json({ message: "transactionId is required" });
// //   }

// //   try {
// //     const transaction = await Transaction.findById(transactionId);
// //     if (!transaction)
// //       return res.status(400).json({ message: "Transaction not found" });

// //     // 2️⃣ Handle client-reported failure
// //     if (status === "FAILED") {
// //       transaction.status = "FAILED";
// //       await transaction.save();
// //       return res.json({
// //         message: "FAILED",
// //         status: "FAILED",
// //         deliveryAddress: transaction.deliveryAddress,
// //       });
// //     }

// //     // 3️⃣ ESEWA payment status check
// //     if (transaction.payment_gateway === "esewa") {
// //       const response = await axios.get(process.env.ESEWA_PAYMENT_STATUS_CHECK_URL, {
// //         params: {
// //           product_code: process.env.ESEWA_MERCHANT_ID,
// //           total_amount: transaction.amount,
// //           transaction_uuid: transaction._id.toString(),
// //         },
// //       });

// //       if (response.data.status === "COMPLETE") {
// //         // mark completed and perform post-payment processing (stock update + clear cart)
// //         transaction.status = "COMPLETED";
// //         await transaction.save();

// //         // post-payment processing (idempotent)
// //         await postPaymentProcessing(transaction);

// //         return res.json({
// //           message: "COMPLETED",
// //           status: "COMPLETED",
// //           deliveryAddress: transaction.deliveryAddress,
// //         });
// //       }
// //     }

// //     // 4️⃣ Khalti payment status check
// //     if (transaction.payment_gateway === "khalti") {
// //       if (!pidx) {
// //         return res
// //           .status(400)
// //           .json({ message: "pidx is required for Khalti verification" });
// //       }

// //       const response = await axios.post(
// //         process.env.KHALTI_VERIFICATION_URL,
// //         { pidx },
// //         {
// //           headers: {
// //             Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
// //             "Content-Type": "application/json",
// //           },
// //         }
// //       );

// //       if (response.data.status === "Completed") {
// //         transaction.status = "COMPLETED";
// //         await transaction.save();

// //         // post-payment processing (idempotent)
// //         await postPaymentProcessing(transaction);

// //         return res.json({
// //           message: "COMPLETED",
// //           status: "COMPLETED",
// //           deliveryAddress: transaction.deliveryAddress,
// //         });
// //       }
// //     }

// //     // 5️⃣ Fallback = FAILED
// //     transaction.status = "FAILED";
// //     await transaction.save();
// //     return res.json({
// //       message: "FAILED",
// //       status: "FAILED",
// //       deliveryAddress: transaction.deliveryAddress,
// //     });
// //   } catch (err) {
// //     console.error("❌ Payment status error:", err.message);
// //     return res.status(500).json({
// //       message: "Payment status check failed",
// //       error: err.message,
// //     });
// //   }
// // };

// // module.exports = { initiatePayment, paymentStatus };


// const Transaction = require("../models/paymentModel");
// const Product = require("../models/Product");
// const { User } = require("../models/User");
// const { generateHmacSha256Hash } = require("../utils/helper");
// const axios = require("axios");
// const qs = require("querystring"); // for eSewa

// // ===============================
// // HELPER: POST-PAYMENT PROCESSING
// // Deduct stock and remove purchased items from user cart
// // ===============================
// async function postPaymentProcessing(transaction) {
//   try {
//     // Skip if already processed
//     if (transaction.stockUpdated) return;

//     const cartItems = transaction.cartItems || [];
//     if (!cartItems.length) return;

//     // 1️⃣ Deduct stock for each purchased product
//     for (const item of cartItems) {
//       const prodId = item.productId;
//       const qty = Number(item.quantity || 0);
//       if (!prodId || qty <= 0) continue;

//       const product = await Product.findById(prodId);
//       if (!product) {
//         console.warn(`Product not found while updating stock: ${prodId}`);
//         continue;
//       }

//       product.stock = Math.max(product.stock - qty, 0);
//       await product.save();
//     }

//     // 2️⃣ Remove purchased items from user's cart
//     const user = await User.findById(transaction.user);
//     if (user) {
//       const purchasedIds = new Set(cartItems.map((i) => i.productId.toString()));
//       user.cart = (user.cart || []).filter(
//         (ci) => !purchasedIds.has(ci.product.toString())
//       );
//       await user.save();
//     }

//     // 3️⃣ Mark transaction as processed for stock
//     transaction.stockUpdated = true;
//     await transaction.save();
//   } catch (err) {
//     console.error("Error in postPaymentProcessing:", err);
//   }
// }

// // ===============================
// // INITIATE PAYMENT
// // ===============================
// const initiatePayment = async (req, res) => {
//   const {
//     amount,
//     cartItems,
//     paymentGateway,
//     customerName,
//     customerEmail,
//     customerPhone,
//     deliveryAddress,
//   } = req.body;

//   if (!paymentGateway || !cartItems || !deliveryAddress) {
//     return res.status(400).json({ message: "Missing required fields" });
//   }
//   if (!cartItems.length) {
//     return res.status(400).json({ message: "Cart is empty" });
//   }

//   try {
//     const transaction = await Transaction.create({
//       user: req.user._id,
//       customerDetails: { name: customerName, email: customerEmail, phone: customerPhone },
//       cartItems,
//       amount,
//       payment_gateway: paymentGateway,
//       status: "PENDING",
//       deliveryAddress,
//     });

//     console.log("✅ Transaction created:", transaction._id.toString());

//     // ===== ESEWA =====
//     if (paymentGateway === "esewa") {
//       const paymentData = {
//         amount: amount.toString(),
//         tax_amount: "0",
//         total_amount: amount.toString(),
//         transaction_uuid: transaction._id.toString(),
//         product_code: process.env.ESEWA_MERCHANT_ID,
//         product_service_charge: "0",
//         product_delivery_charge: "0",
//         success_url: process.env.SUCCESS_URL,
//         failure_url: process.env.FAILURE_URL,
//         signed_field_names: "total_amount,transaction_uuid,product_code",
//       };
//       const dataToSign = `total_amount=${paymentData.total_amount},transaction_uuid=${paymentData.transaction_uuid},product_code=${paymentData.product_code}`;
//       paymentData.signature = generateHmacSha256Hash(dataToSign, process.env.ESEWA_SECRET);

//       const payment = await axios.post(
//         process.env.ESEWA_PAYMENT_URL,
//         qs.stringify(paymentData),
//         { headers: { "Content-Type": "application/x-www-form-urlencoded" }, maxRedirects: 0, validateStatus: (status) => status >= 200 && status < 400 }
//       );

//       const paymentUrl = payment.headers?.location || payment.request?.res?.responseUrl;
//       if (!paymentUrl) throw new Error("Payment URL missing from eSewa");

//       return res.json({ url: paymentUrl, transactionId: transaction._id });
//     }

//     // ===== KHALTI =====
//     if (paymentGateway === "khalti") {
//       const payment = await axios.post(
//         process.env.KHALTI_PAYMENT_URL,
//         {
//           amount: amount * 100,
//           mobile: customerPhone,
//           product_identity: transaction._id.toString(),
//           product_name: cartItems.map((i) => i.name).join(", "),
//           return_url: process.env.SUCCESS_URL,
//           failure_url: process.env.FAILURE_URL,
//           purchase_order_id: transaction._id.toString(),
//           purchase_order_name: cartItems.map((i) => i.name).join(", "),
//           website_url: "http://localhost:5173",
//         },
//         { headers: { Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`, "Content-Type": "application/json" } }
//       );

//       const paymentUrl = payment.data?.payment_url;
//       if (!paymentUrl) throw new Error("Payment URL missing from Khalti");

//       return res.json({ url: paymentUrl, transactionId: transaction._id });
//     }

//     return res.status(400).json({ message: "Invalid payment gateway" });
//   } catch (error) {
//     console.error("❌ Payment initiation error:", error.message);
//     return res.status(500).json({ message: "Payment initiation failed", error: error.message });
//   }
// };

// // ===============================
// // PAYMENT STATUS CHECK
// // ===============================
// const paymentStatus = async (req, res) => {
//   const { transactionId, status, pidx } = req.body;

//   if (!transactionId) return res.status(400).json({ message: "transactionId is required" });

//   try {
//     const transaction = await Transaction.findById(transactionId);
//     if (!transaction) return res.status(400).json({ message: "Transaction not found" });

//     // Client-reported failure
//     if (status === "FAILED") {
//       transaction.status = "FAILED";
//       await transaction.save();
//       return res.json({ message: "FAILED", status: "FAILED", deliveryAddress: transaction.deliveryAddress });
//     }

//     // ===== ESEWA STATUS CHECK =====
//     if (transaction.payment_gateway === "esewa") {
//       const response = await axios.get(process.env.ESEWA_PAYMENT_STATUS_CHECK_URL, {
//         params: { product_code: process.env.ESEWA_MERCHANT_ID, total_amount: transaction.amount, transaction_uuid: transaction._id.toString() },
//       });

//       if (response.data.status === "COMPLETE") {
//         transaction.status = "COMPLETED";
//         await transaction.save();

//         await postPaymentProcessing(transaction);

//         return res.json({ message: "COMPLETED", status: "COMPLETED", deliveryAddress: transaction.deliveryAddress });
//       }
//     }

//     // ===== KHALTI STATUS CHECK =====
//     if (transaction.payment_gateway === "khalti") {
//       if (!pidx) return res.status(400).json({ message: "pidx is required for Khalti verification" });

//       const response = await axios.post(process.env.KHALTI_VERIFICATION_URL, { pidx }, { headers: { Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`, "Content-Type": "application/json" } });

//       if (response.data.status === "Completed") {
//         transaction.status = "COMPLETED";
//         await transaction.save();

//         await postPaymentProcessing(transaction);

//         return res.json({ message: "COMPLETED", status: "COMPLETED", deliveryAddress: transaction.deliveryAddress });
//       }
//     }

//     // Fallback = FAILED
//     transaction.status = "FAILED";
//     await transaction.save();
//     return res.json({ message: "FAILED", status: "FAILED", deliveryAddress: transaction.deliveryAddress });
//   } catch (err) {
//     console.error("❌ Payment status error:", err.message);
//     return res.status(500).json({ message: "Payment status check failed", error: err.message });
//   }
// };

// module.exports = { initiatePayment, paymentStatus };


// controllers/paymentController.js
const Transaction = require("../models/paymentModel");
const Product = require("../models/Product");
const { User } = require("../models/User");
const { generateHmacSha256Hash } = require("../utils/helper");
const axios = require("axios");
const qs = require("querystring"); // for eSewa

// ===============================
// HELPER: POST-PAYMENT PROCESSING
// - Deduct stock (using atomic updates where possible)
// - Atomically remove purchased items from user's cart and push order into user's orders
// - Mark transaction.stockUpdated to avoid double-processing
// ===============================
async function postPaymentProcessing(transaction) {
  try {
    if (transaction.stockUpdated) return;

    const cartItems = transaction.cartItems || [];
    if (!cartItems.length) return;

    // 1) Deduct stock for each product (atomic $inc)
    for (const item of cartItems) {
      const prodId = item.productId;
      const qty = Number(item.quantity || 0);
      if (!prodId || qty <= 0) continue;

      // Decrement by qty
      await Product.findByIdAndUpdate(prodId, { $inc: { stock: -qty } });

      // If stock goes negative, clamp to zero
      await Product.updateOne({ _id: prodId, stock: { $lt: 0 } }, { $set: { stock: 0 } });
    }

    // 2) Build order payload to push into user's orders
    const orderData = {
      transactionId: transaction._id,
      items: cartItems.map((item) => ({
        product: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount: transaction.amount,
      paymentGateway: transaction.payment_gateway,
      status: "COMPLETED",
      deliveryAddress: transaction.deliveryAddress,
      purchasedAt: new Date(),
    };

    // 3) Atomically remove purchased items from cart and push order
    const purchasedIds = cartItems.map((i) => i.productId);

    await User.findByIdAndUpdate(
      transaction.user,
      {
        // remove cart items whose 'product' is in purchasedIds
        $pull: { cart: { product: { $in: purchasedIds } } },
        // push new order
        $push: { orders: orderData },
      },
      { new: true }
    );

    // 4) Mark transaction as processed
    transaction.stockUpdated = true;
    await transaction.save();
  } catch (err) {
    console.error("Error in postPaymentProcessing:", err);
    // don't rethrow — we don't want to fail the response if post-processing has problems.
  }
}

// ===============================
// INITIATE PAYMENT
// (same logic as before; creates Transaction and returns redirect URL + transactionId)
// ===============================
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

  try {
    const transaction = await Transaction.create({
      user: req.user._id,
      customerDetails: { name: customerName, email: customerEmail, phone: customerPhone },
      cartItems,
      amount,
      payment_gateway: paymentGateway,
      status: "PENDING",
      deliveryAddress,
    });

    console.log("✅ Transaction created:", transaction._id.toString());

    // ESEWA
    if (paymentGateway === "esewa") {
      const paymentData = {
        amount: amount.toString(),
        tax_amount: "0",
        total_amount: amount.toString(),
        transaction_uuid: transaction._id.toString(),
        product_code: process.env.ESEWA_MERCHANT_ID,
        product_service_charge: "0",
        product_delivery_charge: "0",
        success_url: process.env.SUCCESS_URL,
        failure_url: process.env.FAILURE_URL,
        signed_field_names: "total_amount,transaction_uuid,product_code",
      };
      const dataToSign = `total_amount=${paymentData.total_amount},transaction_uuid=${paymentData.transaction_uuid},product_code=${paymentData.product_code}`;
      paymentData.signature = generateHmacSha256Hash(dataToSign, process.env.ESEWA_SECRET);

      const payment = await axios.post(
        process.env.ESEWA_PAYMENT_URL,
        qs.stringify(paymentData),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" }, maxRedirects: 0, validateStatus: (status) => status >= 200 && status < 400 }
      );

      const paymentUrl = payment.headers?.location || payment.request?.res?.responseUrl;
      if (!paymentUrl) throw new Error("Payment URL missing from eSewa");

      return res.json({ url: paymentUrl, transactionId: transaction._id });
    }

    // KHALTI
    if (paymentGateway === "khalti") {
      const payment = await axios.post(
        process.env.KHALTI_PAYMENT_URL,
        {
          amount: amount * 100,
          mobile: customerPhone,
          product_identity: transaction._id.toString(),
          product_name: cartItems.map((i) => i.name).join(", "),
          return_url: process.env.SUCCESS_URL,
          failure_url: process.env.FAILURE_URL,
          purchase_order_id: transaction._id.toString(),
          purchase_order_name: cartItems.map((i) => i.name).join(", "),
          website_url: "http://localhost:5173",
        },
        { headers: { Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`, "Content-Type": "application/json" } }
      );

      const paymentUrl = payment.data?.payment_url;
      if (!paymentUrl) throw new Error("Payment URL missing from Khalti");

      return res.json({ url: paymentUrl, transactionId: transaction._id });
    }

    return res.status(400).json({ message: "Invalid payment gateway" });
  } catch (error) {
    console.error("❌ Payment initiation error:", error.message);
    return res.status(500).json({ message: "Payment initiation failed", error: error.message });
  }
};

// ===============================
// PAYMENT STATUS CHECK
// - verifies with provider and triggers postPaymentProcessing when COMPLETED
// ===============================
const paymentStatus = async (req, res) => {
  const { transactionId, status, pidx } = req.body;

  if (!transactionId) return res.status(400).json({ message: "transactionId is required" });

  try {
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) return res.status(400).json({ message: "Transaction not found" });

    // Client-reported failure
    if (status === "FAILED") {
      transaction.status = "FAILED";
      await transaction.save();
      return res.json({ message: "FAILED", status: "FAILED", deliveryAddress: transaction.deliveryAddress });
    }

    // ESEWA status check
    if (transaction.payment_gateway === "esewa") {
      const response = await axios.get(process.env.ESEWA_PAYMENT_STATUS_CHECK_URL, {
        params: { product_code: process.env.ESEWA_MERCHANT_ID, total_amount: transaction.amount, transaction_uuid: transaction._id.toString() },
      });

      if (response.data.status === "COMPLETE") {
        transaction.status = "COMPLETED";
        await transaction.save();

        // post-processing: stock decrement + cart clear + add order
        await postPaymentProcessing(transaction);

        return res.json({ message: "COMPLETED", status: "COMPLETED", deliveryAddress: transaction.deliveryAddress });
      }
    }

    // Khalti verification
    if (transaction.payment_gateway === "khalti") {
      if (!pidx) return res.status(400).json({ message: "pidx is required for Khalti verification" });

      const response = await axios.post(process.env.KHALTI_VERIFICATION_URL, { pidx }, { headers: { Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`, "Content-Type": "application/json" } });

      if (response.data.status === "Completed") {
        transaction.status = "COMPLETED";
        await transaction.save();

        // post-processing
        await postPaymentProcessing(transaction);

        return res.json({ message: "COMPLETED", status: "COMPLETED", deliveryAddress: transaction.deliveryAddress });
      }
    }

    // fallback
    transaction.status = "FAILED";
    await transaction.save();
    return res.json({ message: "FAILED", status: "FAILED", deliveryAddress: transaction.deliveryAddress });
  } catch (err) {
    console.error("❌ Payment status error:", err.message);
    return res.status(500).json({ message: "Payment status check failed", error: err.message });
  }
};

module.exports = { initiatePayment, paymentStatus };

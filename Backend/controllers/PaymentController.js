// // file: Backend/controllers/PaymentController.js
// // ===============================
// // ENVIRONMENT CHECK
// // ===============================
// console.log("🔍 Environment check:", {
//   hasEsewaId: !!process.env.ESEWA_MERCHANT_ID,
//   hasEsewaSecret: !!process.env.ESEWA_SECRET,
//   hasEsewaUrl: !!process.env.ESEWA_PAYMENT_URL,
//   hasKhaltiKey: !!process.env.KHALTI_SECRET_KEY,
//   hasUrls: !!process.env.SUCCESS_URL && !!process.env.FAILURE_URL,
// });

// // ===============================
// // IMPORTS
// // ===============================
// const Transaction = require("../models/paymentModel");
// const Product = require("../models/Product");
// const { User } = require("../models/User");
// const { generateHmacSha256Hash } = require("../utils/helper");
// const axios = require("axios");
// const qs = require("querystring");
// const nodemailer = require("nodemailer");

// // ===============================
// // SMTP TRANSPORTER
// // ===============================
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL,
//     pass: process.env.EMAIL_PASSWORD,
//   },
// });

// // ===============================
// // HELPER - SEND TRANSACTION EMAIL
// // ===============================
// async function sendTransactionEmail(transaction) {
//   try {
//     // Atomic update: only send email once
//     const guard = await Transaction.findOneAndUpdate(
//       { _id: transaction._id, emailSent: { $ne: true } },
//       { $set: { emailSent: true } },
//       { new: true }
//     );
//     if (!guard) return console.log("✉️ Email already sent or transaction missing.");

//     const toEmail =
//       (transaction.customerDetails && transaction.customerDetails.email) ||
//       transaction.customerEmail ||
//       null;
//     if (!toEmail) return console.log("✉️ No customer email found, skipping email.");

//     // Format delivery address nicely
//     let formattedAddress = "Not provided";
//     if (transaction.deliveryAddress && typeof transaction.deliveryAddress === "object") {
//       const addr = transaction.deliveryAddress;
//       formattedAddress = [addr.street, addr.city, addr.state, addr.zip, addr.country]
//         .filter(Boolean)
//         .join("<br>");
//     } else if (typeof transaction.deliveryAddress === "string") {
//       formattedAddress = transaction.deliveryAddress;
//     }

//     // Build items HTML
//     const itemsHtml = (transaction.cartItems || [])
//       .map(
//         (it) =>
//           `<tr>
//              <td style="padding:6px 10px;border:1px solid #eee">${it.name || it.productId}</td>
//              <td style="padding:6px 10px;border:1px solid #eee;text-align:center">${it.quantity || 0}</td>
//              <td style="padding:6px 10px;border:1px solid #eee;text-align:right">${it.price != null ? it.price : "-"}</td>
//            </tr>`
//       )
//       .join("");

//     // ===============================
//     // CALCULATE TAX & SHIPPING FROM TOTAL (EMAIL ONLY)
//     // ===============================
//     const totalAmount = Number(transaction.amount) || 0;

//     let subtotal = 0;
//     let taxAmount = 0;
//     let deliveryCharge = 0;

//     // Assume free shipping if subtotal > 3000
//     // We must reverse-calculate subtotal first
//     const possibleSubtotalFree = totalAmount / 1.13;

//     if (possibleSubtotalFree > 3000) {
//       // ✅ Free shipping case
//       subtotal = possibleSubtotalFree;
//       deliveryCharge = 0;
//     } else {
//       // ✅ Shipping charged case
//       subtotal = (totalAmount - 100) / 1.13;
//       deliveryCharge = 100;
//     }

//     // Final rounding
//     subtotal = Math.round(subtotal);
//     taxAmount = Math.round(subtotal * 0.13);

//     const html = `
//       <div style="font-family: Arial, sans-serif; line-height:1.4; color:#222; padding:18px">
//         <h2 style="color:#2e7d32; margin-bottom:0.2rem">Thank you for your order!</h2>
//         <p style="margin-top:6px">Hi ${transaction.customerDetails?.name || "Customer"},</p>
//         <p>We received your payment successfully. Here are the details of your purchase:</p>

//         <h3 style="margin-bottom:6px">Order Summary</h3>
//         <table style="border-collapse:collapse; width:100%; max-width:700px">
//           <thead>
//             <tr>
//               <th style="padding:8px 10px;border:1px solid #eee;text-align:left">Product</th>
//               <th style="padding:8px 10px;border:1px solid #eee;text-align:center">Qty</th>
//               <th style="padding:8px 10px;border:1px solid #eee;text-align:right">Price</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${itemsHtml || '<tr><td colspan="3" style="padding:10px">No items</td></tr>'}
//             <tr>
//               <td colspan="2" style="padding:8px 10px;border:1px solid #eee;text-align:right">Subtotal</td>
//               <td style="padding:8px 10px;border:1px solid #eee;text-align:right">${subtotal}</td>
//             </tr>
//             <tr>
//               <td colspan="2" style="padding:8px 10px;border:1px solid #eee;text-align:right">Tax</td>
//               <td style="padding:8px 10px;border:1px solid #eee;text-align:right">${taxAmount}</td>
//             </tr>
//             <tr>
//               <td colspan="2" style="padding:8px 10px;border:1px solid #eee;text-align:right">Delivery Charge</td>
//               <td style="padding:8px 10px;border:1px solid #eee;text-align:right">${deliveryCharge}</td>
//             </tr>
//             <tr>
//               <td colspan="2" style="padding:8px 10px;border:1px solid #eee;text-align:right"><strong>Total</strong></td>
//               <td style="padding:8px 10px;border:1px solid #eee;text-align:right"><strong>${transaction.amount}</strong></td>
//             </tr>
//           </tbody>
//         </table>

//         <p style="margin-top:12px"><strong>Transaction ID:</strong> ${transaction._id}</p>
//         <p><strong>Payment Gateway:</strong> ${transaction.payment_gateway || "N/A"}</p>

//         <h4 style="margin-bottom:6px">Delivery Address</h4>
//         <p style="margin-top:0">${formattedAddress}</p>

//         <p style="font-size:0.95rem;color:#555">If you have any questions, reply to this email or contact our support.</p>

//         <hr style="border:none;border-top:1px solid #eee;margin:12px 0" />
//         <p style="font-size:0.85rem;color:#666">FloraVerse — Order confirmation</p>
//       </div>
//     `;

//     await transporter.sendMail({
//       from: `"FloraVerse Team" <${process.env.EMAIL}>`,
//       to: toEmail,
//       subject: `FloraVerse | Order Confirmation — ${transaction._id}`,
//       html,
//     });

//     console.log("✉️ Order email sent for transaction:", transaction._id);
//   } catch (err) {
//     console.error("❌ Failed to send order email:", err);
//   }
// }

// // ===============================
// // MARK COD AS PAID (CONFIRM CASH ON DELIVERY)
// // ===============================
// const markCodPaid = async (req, res) => {
//   try {
//     const transactionId = req.params.transactionId || req.body.transactionId;
//     if (!transactionId) return res.status(400).json({ message: "transactionId is required" });

//     const transaction = await Transaction.findById(transactionId);
//     if (!transaction) return res.status(404).json({ message: "Transaction not found" });

//     // Ensure this is a COD transaction
//     if (transaction.payment_gateway !== "cod") {
//       return res.status(400).json({ message: "Not a Cash-on-Delivery transaction" });
//     }

//     // If already completed, return current status
//     if (transaction.status === "COMPLETED") {
//       return res.json({ status: "COMPLETED", transactionId: transaction._id });
//     }

//     // Mark completed and keep deliveryStatus as PENDING (or update if you prefer)
//     transaction.status = "COMPLETED";
//     transaction.deliveryStatus = transaction.deliveryStatus || "PENDING";
//     await transaction.save();

//     console.log("✅ COD marked as paid:", transaction._id.toString());

//     // Run the same post-payment processing as online gateways:
//     // - deduct stock (if not already done),
//     // - add order entry to user, remove from cart, etc.
//     try {
//       await postPaymentProcessing(transaction);
//     } catch (ppErr) {
//       console.error("❌ postPaymentProcessing failed for COD:", ppErr);
//       // Continue — we still want to attempt sending email even if stock update fails
//     }

//     // Send confirmation email (will only send once due to guard in sendTransactionEmail)
//     try {
//       await sendTransactionEmail(transaction);
//     } catch (emailErr) {
//       console.error("❌ sendTransactionEmail failed for COD:", emailErr);
//     }

//     return res.json({ status: "COMPLETED", transactionId: transaction._id });
//   } catch (err) {
//     console.error("❌ markCodPaid error:", err);
//     return res.status(500).json({ message: "Failed to mark COD as paid", error: err.message });
//   }
// };



// // ===============================
// // POST-PAYMENT PROCESSING
// // ===============================
// async function postPaymentProcessing(transaction) {
//   try {
//     const updateResult = await Transaction.findOneAndUpdate(
//       { _id: transaction._id, stockUpdated: false },
//       { $set: { stockUpdated: true, deliveryStatus: "PENDING" } },
//       { new: true }
//     );
//     if (!updateResult) return console.log("⏭️ Transaction already processed, skipping");

//     const cartItems = transaction.cartItems || [];
//     if (!cartItems.length) return;

//     // Deduct stock
//     for (const item of cartItems) {
//       const prodId = item.productId;
//       const qty = Number(item.quantity || 0);
//       if (!prodId || qty <= 0) continue;
//       await Product.findByIdAndUpdate(prodId, { $inc: { stock: -qty } });
//       await Product.updateOne({ _id: prodId, stock: { $lt: 0 } }, { $set: { stock: 0 } });
//     }

//     // Update user orders
//     const orderData = {
//       transactionId: transaction._id,
//       items: cartItems.map((item) => ({
//         product: item.productId,
//         quantity: item.quantity,
//         price: item.price,
//       })),
//       totalAmount: transaction.amount,
//       paymentGateway: transaction.payment_gateway,
//       status: "COMPLETED",
//       deliveryStatus: "PENDING",
//       deliveryAddress: transaction.deliveryAddress,
//       purchasedAt: new Date(),
//     };

//     const purchasedIds = cartItems.map((i) => i.productId);

//     await User.findOneAndUpdate(
//       { _id: transaction.user, "orders.transactionId": { $ne: transaction._id } },
//       { $pull: { cart: { product: { $in: purchasedIds } } }, $push: { orders: orderData } }
//     );
//   } catch (err) {
//     console.error("❌ Post-payment processing error:", err);
//   }
// }

// // ===============================
// // INITIATE PAYMENT
// // ===============================
// const initiatePayment = async (req, res) => {
//   const { amount, cartItems, paymentGateway, customerName, customerEmail, customerPhone, deliveryAddress } = req.body;
//   if (!paymentGateway || !cartItems || !deliveryAddress) return res.status(400).json({ message: "Missing required fields" });
//   if (!cartItems.length) return res.status(400).json({ message: "Cart is empty" });

//   const safeAmount = Math.round(Number(amount));
//   try {
//     const transaction = await Transaction.create({
//       user: req.user._id,
//       customerDetails: { name: customerName, email: customerEmail, phone: customerPhone },
//       cartItems,
//       amount: safeAmount,
//       payment_gateway: paymentGateway,
//       status: "PENDING",
//       deliveryStatus: "PENDING",
//       deliveryAddress,
//     });

//     console.log("✅ Transaction created:", transaction._id.toString());

//     if (paymentGateway === "esewa") {
//       const paymentData = {
//         amount: safeAmount.toString(),
//         tax_amount: "0",
//         total_amount: safeAmount.toString(),
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

//       const paymentUrl = payment.headers?.location;
//       if (!paymentUrl) throw new Error("Payment URL missing from eSewa response");
//       return res.json({ url: paymentUrl, transactionId: transaction._id });
//     }

//     if (paymentGateway === "khalti") {
//       const khaltiPayload = {
//         return_url: process.env.SUCCESS_URL,
//         website_url: "http://localhost:5173",
//         amount: safeAmount * 100,
//         purchase_order_id: transaction._id.toString(),
//         purchase_order_name: cartItems.map((i) => i.name).join(", ").substring(0, 100),
//         customer_info: { name: customerName, email: customerEmail, phone: customerPhone },
//       };

//       const payment = await axios.post(process.env.KHALTI_PAYMENT_URL, khaltiPayload, { headers: { Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`, "Content-Type": "application/json" } });
//       if (!payment.data?.payment_url) throw new Error("Payment URL missing from Khalti");
//       return res.json({ url: payment.data.payment_url, transactionId: transaction._id });
//     }

//     return res.status(400).json({ message: "Invalid payment gateway" });
//   } catch (error) {
//     console.error("❌ Payment initiation error:", error.message);
//     return res.status(500).json({ message: "Payment initiation failed", error: error.message });
//   }
// };


// const initiateCashOnDeliveryPayment = async (req, res) => {
//   try {
//     const {
//       amount,
//       cartItems,
//       customerName,
//       customerEmail,
//       customerPhone,
//       deliveryAddress,
//     } = req.body;

//     if (!cartItems || !deliveryAddress)
//       return res.status(400).json({ message: "Missing required fields" });
//     if (!cartItems.length)
//       return res.status(400).json({ message: "Cart is empty" });

//     const safeAmount = Math.round(Number(amount));

//     const transaction = await Transaction.create({
//       user: req.user._id,
//       customerDetails: {
//         name: customerName,
//         email: customerEmail,
//         phone: customerPhone,
//       },
//       cartItems,
//       amount: safeAmount,
//       payment_gateway: "cod",
//       status: "PENDING", // ✅ cash collected later
//       deliveryStatus: "PENDING",
//       deliveryAddress,
//     });

//     console.log("✅ COD Transaction created:", transaction._id.toString());

//     return res.json({
//       transactionId: transaction._id,
//       message: "Order placed successfully (Cash on Delivery)",
//     });
//   } catch (err) {
//     console.error("❌ COD error:", err);
//     return res.status(500).json({ message: "COD initiation failed" });
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

//     if (status === "FAILED") {
//       transaction.status = "FAILED";
//       await transaction.save();
//       return res.json({ status: "FAILED" });
//     }

//     if (transaction.payment_gateway === "esewa") {
//       const response = await axios.get(process.env.ESEWA_PAYMENT_STATUS_CHECK_URL, { params: { product_code: process.env.ESEWA_MERCHANT_ID, total_amount: transaction.amount, transaction_uuid: transaction._id.toString() } });
//       if (response.data.status === "COMPLETE") {
//         transaction.status = "COMPLETED";
//         transaction.deliveryStatus = "PENDING";
//         await transaction.save();
//         await postPaymentProcessing(transaction);
//         await sendTransactionEmail(transaction);
//         return res.json({ status: "COMPLETED" });
//       }
//     }

//     if (transaction.payment_gateway === "khalti") {
//       if (!pidx) return res.status(400).json({ message: "pidx is required for Khalti" });
//       const response = await axios.post(process.env.KHALTI_VERIFICATION_URL, { pidx }, { headers: { Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`, "Content-Type": "application/json" } });
//       if (response.data.status === "Completed") {
//         transaction.status = "COMPLETED";
//         transaction.deliveryStatus = "PENDING";
//         await transaction.save();
//         await postPaymentProcessing(transaction);
//         await sendTransactionEmail(transaction);
//         return res.json({ status: "COMPLETED" });
//       }
//     }

//     transaction.status = "FAILED";
//     await transaction.save();
//     return res.json({ status: "FAILED" });
//   } catch (err) {
//     console.error("❌ Payment status error:", err.message);
//     return res.status(500).json({ message: "Payment status check failed", error: err.message });
//   }
// };

// module.exports = {
//   initiatePayment,
//   paymentStatus,
//   initiateCashOnDeliveryPayment,
//   markCodPaid,
// };



// // Backend/controllers/PaymentController.js

// // ===============================
// // ENVIRONMENT CHECK
// // ===============================
// console.log("🔍 Environment check:", {
//   hasEsewaId: !!process.env.ESEWA_MERCHANT_ID,
//   hasEsewaSecret: !!process.env.ESEWA_SECRET,
//   hasEsewaUrl: !!process.env.ESEWA_PAYMENT_URL,
//   hasKhaltiKey: !!process.env.KHALTI_SECRET_KEY,
//   hasUrls: !!process.env.SUCCESS_URL && !!process.env.FAILURE_URL,
// });

// // ===============================
// // IMPORTS
// // ===============================
// const Transaction = require("../models/paymentModel");
// const Product = require("../models/Product");
// const { User } = require("../models/User");
// const { generateHmacSha256Hash } = require("../utils/helper");
// const axios = require("axios");
// const qs = require("querystring");
// const nodemailer = require("nodemailer");

// // ===============================
// // SMTP TRANSPORTER (GMAIL APP PASSWORD REQUIRED)
// // ===============================
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL,
//     pass: process.env.EMAIL_PASSWORD, // MUST be Gmail App Password
//   },
// });

// transporter.verify((err) => {
//   if (err) console.error("❌ SMTP ERROR:", err);
//   else console.log("✅ SMTP READY");
// });

// // ===============================
// // EMAIL SENDER (GUARDED)
// // Supports two templates:
// //  - type === "COD_PLACED" -> email when COD order is placed (optional)
// //  - type === "PAID"       -> email after successful payment (online or COD paid)
// // Each template has its own db flag to avoid duplicates.
// // ===============================
// async function sendTransactionEmail(transaction, type = "PAID") {
//   try {
//     const emailFlag = type === "COD_PLACED" ? "codEmailSent" : "emailSent";

//     // atomic guard: only send once per template
//     const guard = await Transaction.findOneAndUpdate(
//       { _id: transaction._id, [emailFlag]: { $ne: true } },
//       { $set: { [emailFlag]: true } },
//       { new: true }
//     );
//     if (!guard) return console.log(`✉️ Email (${emailFlag}) already sent or missing.`);

//     const toEmail = (transaction.customerDetails && transaction.customerDetails.email) || transaction.customerEmail || null;
//     if (!toEmail) return console.log("✉️ No customer email found, skipping email.");

//     // format address
//     let formattedAddress = "Not provided";
//     if (transaction.deliveryAddress && typeof transaction.deliveryAddress === "object") {
//       const addr = transaction.deliveryAddress;
//       formattedAddress = [addr.label, addr.street, addr.city, addr.state, addr.postalCode, addr.country]
//         .filter(Boolean)
//         .join("<br>");
//     } else if (typeof transaction.deliveryAddress === "string") {
//       formattedAddress = transaction.deliveryAddress;
//     }

//     // items html
//     const itemsHtml = (transaction.cartItems || [])
//       .map(
//         (it) =>
//           `<tr>
//              <td style="padding:6px 10px;border:1px solid #eee">${it.name || it.productId}</td>
//              <td style="padding:6px 10px;border:1px solid #eee;text-align:center">${it.quantity || 0}</td>
//              <td style="padding:6px 10px;border:1px solid #eee;text-align:right">${it.price != null ? it.price : "-"}</td>
//            </tr>`
//       )
//       .join("");

//     // calculate display subtotal/tax/delivery for email only
//     const totalAmount = Number(transaction.amount) || 0;
//     let subtotal = 0;
//     let taxAmount = 0;
//     let deliveryCharge = 0;
//     const possibleSubtotalFree = totalAmount / 1.13;
//     if (possibleSubtotalFree > 3000) {
//       subtotal = possibleSubtotalFree;
//       deliveryCharge = 0;
//     } else {
//       subtotal = (totalAmount - 100) / 1.13;
//       deliveryCharge = 100;
//     }
//     subtotal = Math.round(subtotal);
//     taxAmount = Math.round(subtotal * 0.13);

//     const subject =
//       type === "COD_PLACED"
//         ? `FloraVerse | COD Order Placed — ${transaction._id}`
//         : `FloraVerse | Order Confirmation — ${transaction._id}`;

//     const intro =
//       type === "COD_PLACED"
//         ? "We've received your Cash on Delivery order. Payment will be collected on delivery."
//         : "We've received your payment successfully. Here are the details of your purchase:";

//     const html = `
//       <div style="font-family: Arial, sans-serif; line-height:1.4; color:#222; padding:18px">
//         <h2 style="color:#2e7d32; margin-bottom:0.2rem">${type === "COD_PLACED" ? "Order Placed (Cash on Delivery)" : "Thank you for your order!"}</h2>
//         <p style="margin-top:6px">Hi ${transaction.customerDetails?.name || "Customer"},</p>
//         <p>${intro}</p>

//         <h3 style="margin-bottom:6px">Order Summary</h3>
//         <table style="border-collapse:collapse; width:100%; max-width:700px">
//           <thead>
//             <tr>
//               <th style="padding:8px 10px;border:1px solid #eee;text-align:left">Product</th>
//               <th style="padding:8px 10px;border:1px solid #eee;text-align:center">Qty</th>
//               <th style="padding:8px 10px;border:1px solid #eee;text-align:right">Price</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${itemsHtml || '<tr><td colspan="3" style="padding:10px">No items</td></tr>'}
//             <tr>
//               <td colspan="2" style="padding:8px 10px;border:1px solid #eee;text-align:right">Subtotal</td>
//               <td style="padding:8px 10px;border:1px solid #eee;text-align:right">${subtotal}</td>
//             </tr>
//             <tr>
//               <td colspan="2" style="padding:8px 10px;border:1px solid #eee;text-align:right">Tax</td>
//               <td style="padding:8px 10px;border:1px solid #eee;text-align:right">${taxAmount}</td>
//             </tr>
//             <tr>
//               <td colspan="2" style="padding:8px 10px;border:1px solid #eee;text-align:right">Delivery Charge</td>
//               <td style="padding:8px 10px;border:1px solid #eee;text-align:right">${deliveryCharge}</td>
//             </tr>
//             <tr>
//               <td colspan="2" style="padding:8px 10px;border:1px solid #eee;text-align:right"><strong>Total</strong></td>
//               <td style="padding:8px 10px;border:1px solid #eee;text-align:right"><strong>${transaction.amount}</strong></td>
//             </tr>
//           </tbody>
//         </table>

//         <p style="margin-top:12px"><strong>Transaction ID:</strong> ${transaction._id}</p>
//         <p><strong>Payment Gateway:</strong> ${transaction.payment_gateway || "N/A"}</p>

//         <h4 style="margin-bottom:6px">Delivery Address</h4>
//         <p style="margin-top:0">${formattedAddress}</p>

//         <p style="font-size:0.95rem;color:#555">If you have any questions, reply to this email or contact our support.</p>

//         <hr style="border:none;border-top:1px solid #eee;margin:12px 0" />
//         <p style="font-size:0.85rem;color:#666">FloraVerse — Order confirmation</p>
//       </div>
//     `;

//     await transporter.sendMail({
//       from: `"FloraVerse Team" <${process.env.EMAIL}>`,
//       to: toEmail,
//       subject,
//       html,
//     });

//     console.log(`✉️ Order email (${emailFlag}) sent for transaction:`, transaction._id);
//   } catch (err) {
//     console.error("❌ Failed to send transaction email:", err);
//   }
// }

// // ===============================
// // POST-PAYMENT PROCESSING (idempotent)
// //  - deduct stock once
// //  - update user's orders once
// // ===============================
// async function postPaymentProcessing(transaction) {
//   try {
//     const updateResult = await Transaction.findOneAndUpdate(
//       { _id: transaction._id, stockUpdated: false },
//       { $set: { stockUpdated: true, deliveryStatus: "PENDING" } },
//       { new: true }
//     );
//     if (!updateResult) return console.log("⏭️ Transaction already processed, skipping");

//     const cartItems = transaction.cartItems || [];
//     if (!cartItems.length) return;

//     // Deduct stock
//     for (const item of cartItems) {
//       const prodId = item.productId;
//       const qty = Number(item.quantity || 0);
//       if (!prodId || qty <= 0) continue;
//       await Product.findByIdAndUpdate(prodId, { $inc: { stock: -qty } });
//       await Product.updateOne({ _id: prodId, stock: { $lt: 0 } }, { $set: { stock: 0 } });
//     }

//     // Update user orders (idempotent push)
//     const orderData = {
//       transactionId: transaction._id,
//       items: cartItems.map((item) => ({
//         product: item.productId,
//         quantity: item.quantity,
//         price: item.price,
//       })),
//       totalAmount: transaction.amount,
//       paymentGateway: transaction.payment_gateway,
//       status: "COMPLETED",
//       deliveryStatus: "PENDING",
//       deliveryAddress: transaction.deliveryAddress,
//       purchasedAt: new Date(),
//     };

//     const purchasedIds = cartItems.map((i) => i.productId);

//     await User.findOneAndUpdate(
//       { _id: transaction.user, "orders.transactionId": { $ne: transaction._id } },
//       { $pull: { cart: { product: { $in: purchasedIds } } }, $push: { orders: orderData } }
//     );

//     console.log("✅ postPaymentProcessing finished for:", transaction._id);
//   } catch (err) {
//     console.error("❌ Post-payment processing error:", err);
//   }
// }

// // ===============================
// // INITIATE PAYMENT (eSewa / Khalti / others)
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

//   if (!paymentGateway || !cartItems || !deliveryAddress)
//     return res.status(400).json({ message: "Missing required fields" });
//   if (!cartItems.length) return res.status(400).json({ message: "Cart is empty" });

//   const safeAmount = Math.round(Number(amount));

//   try {
//     const transaction = await Transaction.create({
//       user: req.user._id,
//       customerDetails: { name: customerName, email: customerEmail, phone: customerPhone },
//       cartItems,
//       amount: safeAmount,
//       payment_gateway: paymentGateway,
//       status: "PENDING",
//       deliveryStatus: "PENDING",
//       deliveryAddress,
//     });

//     console.log("✅ Transaction created:", transaction._id.toString());

//     // eSewa flow
//     if (paymentGateway === "esewa") {
//       // eSewa expects string amounts and specific fields
//       const paymentData = {
//         amount: safeAmount.toString(),
//         tax_amount: "0",
//         total_amount: safeAmount.toString(),
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

//       const payment = await axios.post(process.env.ESEWA_PAYMENT_URL, qs.stringify(paymentData), {
//         headers: { "Content-Type": "application/x-www-form-urlencoded" },
//         maxRedirects: 0,
//         validateStatus: (status) => status >= 200 && status < 400,
//       });

//       const paymentUrl = payment.headers?.location;
//       if (!paymentUrl) throw new Error("Payment URL missing from eSewa response");
//       return res.json({ url: paymentUrl, transactionId: transaction._id });
//     }

//     // Khalti flow
//     if (paymentGateway === "khalti") {
//       const khaltiPayload = {
//         return_url: process.env.SUCCESS_URL,
//         website_url: "http://localhost:5173",
//         amount: safeAmount * 100, // paisa
//         purchase_order_id: transaction._id.toString(),
//         purchase_order_name: cartItems.map((i) => i.name).join(", ").substring(0, 100),
//         customer_info: { name: customerName, email: customerEmail, phone: customerPhone },
//       };

//       const payment = await axios.post(process.env.KHALTI_PAYMENT_URL, khaltiPayload, {
//         headers: { Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`, "Content-Type": "application/json" },
//       });

//       if (!payment.data?.payment_url) throw new Error("Payment URL missing from Khalti");
//       return res.json({ url: payment.data.payment_url, transactionId: transaction._id });
//     }

//     return res.status(400).json({ message: "Invalid payment gateway" });
//   } catch (error) {
//     console.error("❌ Payment initiation error:", error.message || error);
//     return res.status(500).json({ message: "Payment initiation failed", error: error.message || error });
//   }
// };

// // ===============================
// // INITIATE CASH-ON-DELIVERY
// // ===============================
// const initiateCashOnDeliveryPayment = async (req, res) => {
//   try {
//     const {
//       amount,
//       cartItems,
//       customerName,
//       customerEmail,
//       customerPhone,
//       deliveryAddress,
//     } = req.body;

//     if (!cartItems || !deliveryAddress)
//       return res.status(400).json({ message: "Missing required fields" });
//     if (!cartItems.length)
//       return res.status(400).json({ message: "Cart is empty" });

//     const safeAmount = Math.round(Number(amount) || 0);

//     // 1️⃣ Create transaction (PENDING)
//     const transaction = await Transaction.create({
//       user: req.user._id,
//       customerDetails: {
//         name: customerName,
//         email: customerEmail,
//         phone: customerPhone,
//       },
//       cartItems,
//       amount: safeAmount,
//       payment_gateway: "cod",
//       status: "PENDING", // cash not collected yet
//       deliveryStatus: "PENDING",
//       deliveryAddress,
//     });

//     console.log("✅ COD Transaction created:", transaction._id.toString());

//     // 2️⃣ Immediately save order in user.orders (schema-safe)
//     const orderData = {
//       transactionId: transaction._id,
//       items: cartItems.map((item) => ({
//         product: item.productId,
//         quantity: item.quantity,
//         price: item.price,
//       })),
//       totalAmount: transaction.amount,
//       paymentGateway: "cod",
//       status: "COMPLETED", // ⚠️ keep schema happy
//       deliveryStatus: "PENDING",
//       deliveryAddress: transaction.deliveryAddress,
//       purchasedAt: new Date(),
//     };

//     const purchasedIds = cartItems.map((i) => i.productId);

//     await User.findOneAndUpdate(
//       {
//         _id: transaction.user,
//         "orders.transactionId": { $ne: transaction._id }, // idempotent guard
//       },
//       {
//         $pull: { cart: { product: { $in: purchasedIds } } },
//         $push: { orders: orderData },
//       }
//     );

//     console.log("✅ COD order saved directly in user.orders");

//     // 3️⃣ Send "COD placed" email
//     try {
//       await sendTransactionEmail(transaction, "COD_PLACED");
//     } catch (e) {
//       console.error("❌ COD placed email error:", e);
//     }

//     return res.json({
//       transactionId: transaction._id,
//       message: "Order placed successfully (Cash on Delivery)",
//     });
//   } catch (err) {
//     console.error("❌ COD initiation error:", err);
//     return res.status(500).json({
//       message: "COD initiation failed",
//       error: err.message || err,
//     });
//   }
// };


// // ===============================
// // MARK COD AS PAID (CONFIRM CASH ON DELIVERY)
// // ===============================
// // This endpoint should be protected (auth + role check) in your routes
// // Example route: POST /api/payment/mark-cod-paid/:transactionId (auth required)
// const markCodPaid = async (req, res) => {
//   try {
//     const transactionId = req.params.transactionId || req.body.transactionId;
//     if (!transactionId) return res.status(400).json({ message: "transactionId is required" });

//     const transaction = await Transaction.findById(transactionId);
//     if (!transaction) return res.status(404).json({ message: "Transaction not found" });

//     if (transaction.payment_gateway !== "cod") {
//       return res.status(400).json({ message: "Not a Cash-on-Delivery transaction" });
//     }

//     // If already completed, still try to ensure post-processing and email (idempotent)
//     if (transaction.status !== "COMPLETED") {
//       transaction.status = "COMPLETED";
//       transaction.deliveryStatus = transaction.deliveryStatus || "PENDING";
//       await transaction.save();
//     }

//     console.log("✅ COD marked as paid (or already paid):", transaction._id.toString());

//     // run post-payment processing (idempotent)
//     try {
//       await postPaymentProcessing(transaction);
//     } catch (ppErr) {
//       console.error("❌ postPaymentProcessing failed for COD:", ppErr);
//     }

//     // send final confirmation email (guarded)
//     try {
//       await sendTransactionEmail(transaction, "PAID");
//     } catch (emailErr) {
//       console.error("❌ sendTransactionEmail failed for COD:", emailErr);
//     }

//     return res.json({ status: "COMPLETED", transactionId: transaction._id });
//   } catch (err) {
//     console.error("❌ markCodPaid error:", err);
//     return res.status(500).json({ message: "Failed to mark COD as paid", error: err.message || err });
//   }
// };

// // ===============================
// // PAYMENT STATUS (VERIFY ONLINE)
// // - For eSewa: call eSewa status endpoint and mark COMPLETE
// // - For Khalti: verify with pidx and mark COMPLETE
// // Expected body: { transactionId, status?, pidx? }
// // ===============================
// const paymentStatus = async (req, res) => {
//   const { transactionId, status, pidx } = req.body;
//   if (!transactionId) return res.status(400).json({ message: "transactionId is required" });

//   try {
//     const transaction = await Transaction.findById(transactionId);
//     if (!transaction) return res.status(400).json({ message: "Transaction not found" });

//     // allow external caller to set to FAILED
//     if (status === "FAILED") {
//       transaction.status = "FAILED";
//       await transaction.save();
//       return res.json({ status: "FAILED" });
//     }

//     // eSewa verification
//     if (transaction.payment_gateway === "esewa") {
//       try {
//         const response = await axios.get(process.env.ESEWA_PAYMENT_STATUS_CHECK_URL, {
//           params: {
//             product_code: process.env.ESEWA_MERCHANT_ID,
//             total_amount: transaction.amount,
//             transaction_uuid: transaction._id.toString(),
//           },
//         });

//         if (response.data && response.data.status === "COMPLETE") {
//           transaction.status = "COMPLETED";
//           transaction.deliveryStatus = "PENDING";
//           await transaction.save();

//           await postPaymentProcessing(transaction);
//           await sendTransactionEmail(transaction, "PAID");

//           return res.json({ status: "COMPLETED" });
//         }
//       } catch (e) {
//         console.error("❌ eSewa status check error:", e.message || e);
//       }
//     }

//     // Khalti verification
//     if (transaction.payment_gateway === "khalti") {
//       if (!pidx) return res.status(400).json({ message: "pidx is required for Khalti" });
//       try {
//         const response = await axios.post(
//           process.env.KHALTI_VERIFICATION_URL,
//           { pidx },
//           { headers: { Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`, "Content-Type": "application/json" } }
//         );

//         if (response.data && response.data.status === "Completed") {
//           transaction.status = "COMPLETED";
//           transaction.deliveryStatus = "PENDING";
//           await transaction.save();

//           await postPaymentProcessing(transaction);
//           await sendTransactionEmail(transaction, "PAID");

//           return res.json({ status: "COMPLETED" });
//         }
//       } catch (e) {
//         console.error("❌ Khalti verification error:", e.message || e);
//       }
//     }

//     // fallback - not completed
//     transaction.status = "FAILED";
//     await transaction.save();
//     return res.json({ status: "FAILED" });
//   } catch (err) {
//     console.error("❌ Payment status error:", err.message || err);
//     return res.status(500).json({ message: "Payment status check failed", error: err.message || err });
//   }
// };

// // ===============================
// // EXPORTS
// // ===============================
// module.exports = {
//   initiatePayment,
//   paymentStatus,
//   initiateCashOnDeliveryPayment,
//   markCodPaid,
// };


// Backend/controllers/PaymentController.js

// ===============================
// ENVIRONMENT CHECK
// ===============================
console.log("🔍 Environment check:", {
  hasEsewaId: !!process.env.ESEWA_MERCHANT_ID,
  hasEsewaSecret: !!process.env.ESEWA_SECRET,
  hasEsewaUrl: !!process.env.ESEWA_PAYMENT_URL,
  hasKhaltiKey: !!process.env.KHALTI_SECRET_KEY,
  hasUrls: !!process.env.SUCCESS_URL && !!process.env.FAILURE_URL,
});

const Transaction = require("../models/paymentModel");
const Product = require("../models/Product");
const { User } = require("../models/User");
const { generateHmacSha256Hash } = require("../utils/helper");
const axios = require("axios");
const qs = require("querystring");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

transporter.verify((err) => {
  if (err) console.error("❌ SMTP ERROR:", err);
  else console.log("✅ SMTP READY");
});

async function sendTransactionEmail(transaction, type = "PAID") {
  try {
    const emailFlag = type === "COD_PLACED" ? "codEmailSent" : "emailSent";
    const guard = await Transaction.findOneAndUpdate(
      { _id: transaction._id, [emailFlag]: { $ne: true } },
      { $set: { [emailFlag]: true } },
      { new: true }
    );
    if (!guard) return console.log(`✉️ Email (${emailFlag}) already sent or missing.`);

    const toEmail = (transaction.customerDetails && transaction.customerDetails.email) || transaction.customerEmail || null;
    if (!toEmail) return console.log("✉️ No customer email found, skipping email.");

    let formattedAddress = "Not provided";
    if (transaction.deliveryAddress && typeof transaction.deliveryAddress === "object") {
      const addr = transaction.deliveryAddress;
      formattedAddress = [addr.label, addr.street, addr.city, addr.state, addr.postalCode, addr.country]
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
        <h2 style="color:#2e7d32; margin-bottom:0.2rem">${type === "COD_PLACED" ? "Order Placed (Cash on Delivery)" : "Thank you for your order!"}</h2>
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

    console.log(`✉️ Order email (${emailFlag}) sent for transaction:`, transaction._id);
  } catch (err) {
    console.error("❌ Failed to send transaction email:", err);
  }
}

async function postPaymentProcessing(transaction) {
  try {
    const updateResult = await Transaction.findOneAndUpdate(
      { _id: transaction._id, stockUpdated: false },
      { $set: { stockUpdated: true, deliveryStatus: "PENDING" } },
      { new: true }
    );
    if (!updateResult) return console.log("⏭️ Transaction already processed, skipping");

    const cartItems = transaction.cartItems || [];
    if (!cartItems.length) return;

    for (const item of cartItems) {
      const prodId = item.productId;
      const qty = Number(item.quantity || 0);
      if (!prodId || qty <= 0) continue;
      await Product.findByIdAndUpdate(prodId, { $inc: { stock: -qty } });
      await Product.updateOne({ _id: prodId, stock: { $lt: 0 } }, { $set: { stock: 0 } });
    }

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
      deliveryStatus: "PENDING",
      deliveryAddress: transaction.deliveryAddress,
      purchasedAt: new Date(),
    };

    const purchasedIds = cartItems.map((i) => i.productId);

    await User.findOneAndUpdate(
      { _id: transaction.user, "orders.transactionId": { $ne: transaction._id } },
      { $pull: { cart: { product: { $in: purchasedIds } } }, $push: { orders: orderData } }
    );

    console.log("✅ postPaymentProcessing finished for:", transaction._id);
  } catch (err) {
    console.error("❌ Post-payment processing error:", err);
  }
}

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

  if (!paymentGateway || !cartItems || !deliveryAddress)
    return res.status(400).json({ message: "Missing required fields" });
  if (!cartItems.length) return res.status(400).json({ message: "Cart is empty" });

  const safeAmount = Math.round(Number(amount));

  try {
    const transaction = await Transaction.create({
      user: req.user._id,
      customerDetails: { name: customerName, email: customerEmail, phone: customerPhone },
      cartItems,
      amount: safeAmount,
      payment_gateway: paymentGateway,
      status: "PENDING",
      deliveryStatus: "PENDING",
      deliveryAddress,
    });

    console.log("✅ Transaction created:", transaction._id.toString());

    if (paymentGateway === "esewa") {
      const paymentData = {
        amount: safeAmount.toString(),
        tax_amount: "0",
        total_amount: safeAmount.toString(),
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

      // ==============================
      // 🔍 DEBUG BLOCK 1 — SIGNATURE & PAYLOAD
      // ==============================
      console.log("━━━━━━━━━━━━ eSewa DEBUG ━━━━━━━━━━━━");
      console.log("dataToSign   :", dataToSign);
      console.log("signature    :", paymentData.signature);
      console.log("secret       :", JSON.stringify(process.env.ESEWA_SECRET));
      console.log("success_url  :", paymentData.success_url);
      console.log("failure_url  :", paymentData.failure_url);
      console.log("total_amount :", paymentData.total_amount);
      console.log("full payload :", paymentData);
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

      const payment = await axios.post(process.env.ESEWA_PAYMENT_URL, qs.stringify(paymentData), {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        maxRedirects: 0,
        validateStatus: (status) => status >= 200 && status < 400,
      });

      // ==============================
      // 🔍 DEBUG BLOCK 2 — eSewa RESPONSE
      // ==============================
      console.log("━━━━━━━━━━━━ eSewa RESPONSE ━━━━━━━━━━━━");
      console.log("response status :", payment.status);
      console.log("redirect URL    :", payment.headers?.location);
      console.log("response data   :", payment.data);
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

      const paymentUrl = payment.headers?.location;
      if (!paymentUrl) throw new Error("Payment URL missing from eSewa response");
      return res.json({ url: paymentUrl, transactionId: transaction._id });
    }

    if (paymentGateway === "khalti") {
      const khaltiPayload = {
        return_url: process.env.SUCCESS_URL,
        website_url: "http://localhost:5173",
        amount: safeAmount * 100,
        purchase_order_id: transaction._id.toString(),
        purchase_order_name: cartItems.map((i) => i.name).join(", ").substring(0, 100),
        customer_info: { name: customerName, email: customerEmail, phone: customerPhone },
      };

      const payment = await axios.post(process.env.KHALTI_PAYMENT_URL, khaltiPayload, {
        headers: { Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`, "Content-Type": "application/json" },
      });

      if (!payment.data?.payment_url) throw new Error("Payment URL missing from Khalti");
      return res.json({ url: payment.data.payment_url, transactionId: transaction._id });
    }

    return res.status(400).json({ message: "Invalid payment gateway" });
  } catch (error) {
    console.error("❌ Payment initiation error:", error.message || error);
    return res.status(500).json({ message: "Payment initiation failed", error: error.message || error });
  }
};

const initiateCashOnDeliveryPayment = async (req, res) => {
  try {
    const { amount, cartItems, customerName, customerEmail, customerPhone, deliveryAddress } = req.body;

    if (!cartItems || !deliveryAddress)
      return res.status(400).json({ message: "Missing required fields" });
    if (!cartItems.length)
      return res.status(400).json({ message: "Cart is empty" });

    const safeAmount = Math.round(Number(amount) || 0);

    const transaction = await Transaction.create({
      user: req.user._id,
      customerDetails: { name: customerName, email: customerEmail, phone: customerPhone },
      cartItems,
      amount: safeAmount,
      payment_gateway: "cod",
      status: "PENDING",
      deliveryStatus: "PENDING",
      deliveryAddress,
    });

    console.log("✅ COD Transaction created:", transaction._id.toString());

    const orderData = {
      transactionId: transaction._id,
      items: cartItems.map((item) => ({
        product: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount: transaction.amount,
      paymentGateway: "cod",
      status: "COMPLETED",
      deliveryStatus: "PENDING",
      deliveryAddress: transaction.deliveryAddress,
      purchasedAt: new Date(),
    };

    const purchasedIds = cartItems.map((i) => i.productId);

    await User.findOneAndUpdate(
      { _id: transaction.user, "orders.transactionId": { $ne: transaction._id } },
      { $pull: { cart: { product: { $in: purchasedIds } } }, $push: { orders: orderData } }
    );

    console.log("✅ COD order saved directly in user.orders");

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
    return res.status(500).json({ message: "COD initiation failed", error: err.message || err });
  }
};

const markCodPaid = async (req, res) => {
  try {
    const transactionId = req.params.transactionId || req.body.transactionId;
    if (!transactionId) return res.status(400).json({ message: "transactionId is required" });

    const transaction = await Transaction.findById(transactionId);
    if (!transaction) return res.status(404).json({ message: "Transaction not found" });

    if (transaction.payment_gateway !== "cod")
      return res.status(400).json({ message: "Not a Cash-on-Delivery transaction" });

    if (transaction.status !== "COMPLETED") {
      transaction.status = "COMPLETED";
      transaction.deliveryStatus = transaction.deliveryStatus || "PENDING";
      await transaction.save();
    }

    console.log("✅ COD marked as paid (or already paid):", transaction._id.toString());

    try { await postPaymentProcessing(transaction); }
    catch (ppErr) { console.error("❌ postPaymentProcessing failed for COD:", ppErr); }

    try { await sendTransactionEmail(transaction, "PAID"); }
    catch (emailErr) { console.error("❌ sendTransactionEmail failed for COD:", emailErr); }

    return res.json({ status: "COMPLETED", transactionId: transaction._id });
  } catch (err) {
    console.error("❌ markCodPaid error:", err);
    return res.status(500).json({ message: "Failed to mark COD as paid", error: err.message || err });
  }
};

const paymentStatus = async (req, res) => {
  const { transactionId, status, pidx } = req.body;
  if (!transactionId) return res.status(400).json({ message: "transactionId is required" });

  try {
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) return res.status(400).json({ message: "Transaction not found" });

    if (status === "FAILED") {
      transaction.status = "FAILED";
      await transaction.save();
      return res.json({ status: "FAILED" });
    }

    if (transaction.payment_gateway === "esewa") {
      try {
        const response = await axios.get(process.env.ESEWA_PAYMENT_STATUS_CHECK_URL, {
          params: {
            product_code: process.env.ESEWA_MERCHANT_ID,
            total_amount: transaction.amount,
            transaction_uuid: transaction._id.toString(),
          },
        });

        console.log("🔍 eSewa status check response:", response.data);

        if (response.data && response.data.status === "COMPLETE") {
          transaction.status = "COMPLETED";
          transaction.deliveryStatus = "PENDING";
          await transaction.save();
          await postPaymentProcessing(transaction);
          await sendTransactionEmail(transaction, "PAID");
          return res.json({ status: "COMPLETED" });
        }
      } catch (e) {
        console.error("❌ eSewa status check error:", e.message || e);
      }
    }

    if (transaction.payment_gateway === "khalti") {
      if (!pidx) return res.status(400).json({ message: "pidx is required for Khalti" });
      try {
        const response = await axios.post(
          process.env.KHALTI_VERIFICATION_URL,
          { pidx },
          { headers: { Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`, "Content-Type": "application/json" } }
        );

        console.log("🔍 Khalti verification response:", response.data);

        if (response.data && response.data.status === "Completed") {
          transaction.status = "COMPLETED";
          transaction.deliveryStatus = "PENDING";
          await transaction.save();
          await postPaymentProcessing(transaction);
          await sendTransactionEmail(transaction, "PAID");
          return res.json({ status: "COMPLETED" });
        }
      } catch (e) {
        console.error("❌ Khalti verification error:", e.message || e);
      }
    }

    transaction.status = "FAILED";
    await transaction.save();
    return res.json({ status: "FAILED" });
  } catch (err) {
    console.error("❌ Payment status error:", err.message || err);
    return res.status(500).json({ message: "Payment status check failed", error: err.message || err });
  }
};

module.exports = { initiatePayment, paymentStatus, initiateCashOnDeliveryPayment, markCodPaid };
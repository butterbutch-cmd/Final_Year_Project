// // // const Transaction = require("../models/paymentModel");
// // // const { generateHmacSha256Hash } = require("../utils/helper");
// // // const axios = require("axios");

// // // const initiatePayment = async (req, res) => {
// // //   const {
// // //     amount,
// // //     productId,
// // //     paymentGateway,
// // //     customerName,
// // //     customerEmail,
// // //     customerPhone,
// // //     productName,
// // //   } = req.body;

// // //   if (!paymentGateway || !productId) {
// // //     return res.status(400).json({ message: "Missing required fields" });
// // //   }

// // //   try {
// // //     // 1️⃣ SAVE TRANSACTION FIRST
// // //     const transaction = await Transaction.create({
// // //       customerDetails: {
// // //         name: customerName,
// // //         email: customerEmail,
// // //         phone: customerPhone,
// // //       },
// // //       product_name: productName,
// // //       product_id: productId,
// // //       amount,
// // //       payment_gateway: paymentGateway,
// // //       status: "PENDING",
// // //     });

// // //     console.log("✅ Transaction saved:", transaction._id);

// // //     let paymentConfig;

// // //     if (paymentGateway === "esewa") {
// // //       const paymentData = {
// // //         amount,
// // //         failure_url: process.env.FAILURE_URL,
// // //         product_delivery_charge: "0",
// // //         product_service_charge: "0",
// // //         product_code: process.env.ESEWA_MERCHANT_ID,
// // //         signed_field_names: "total_amount,transaction_uuid,product_code",
// // //         success_url: process.env.SUCCESS_URL,
// // //         tax_amount: "0",
// // //         total_amount: amount,
// // //         transaction_uuid: productId,
// // //       };

// // //       const data = `total_amount=${paymentData.total_amount},transaction_uuid=${paymentData.transaction_uuid},product_code=${paymentData.product_code}`;
// // //       const signature = generateHmacSha256Hash(data, process.env.ESEWA_SECRET);

// // //       paymentConfig = {
// // //         url: process.env.ESEWA_PAYMENT_URL,
// // //         data: { ...paymentData, signature },
// // //         headers: { "Content-Type": "application/x-www-form-urlencoded" },
// // //         responseHandler: (response) => response.request?.res?.responseUrl,
// // //       };
// // //     }

// // //     if (paymentGateway === "khalti") {
// // //       paymentConfig = {
// // //         url: process.env.KHALTI_PAYMENT_URL,
// // //         data: {
// // //           amount: amount * 100,
// // //           mobile: customerPhone,
// // //           product_identity: productId,
// // //           product_name: productName,
// // //           return_url: process.env.SUCCESS_URL,
// // //           failure_url: process.env.FAILURE_URL,
// // //           public_key: process.env.KHALTI_PUBLIC_KEY,
// // //           website_url: "http://localhost:5173",
// // //           purchase_order_id: productId,
// // //           purchase_order_name: productName,
// // //         },
// // //         headers: {
// // //           Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
// // //           "Content-Type": "application/json",
// // //         },
// // //         responseHandler: (response) => response.data?.payment_url,
// // //       };
// // //     }

// // //     // 2️⃣ CALL PAYMENT GATEWAY
// // //     const payment = await axios.post(
// // //       paymentConfig.url,
// // //       paymentConfig.data,
// // //       { headers: paymentConfig.headers }
// // //     );

// // //     const paymentUrl = paymentConfig.responseHandler(payment);

// // //     if (!paymentUrl) {
// // //       throw new Error("Payment URL missing from gateway");
// // //     }

// // //     return res.json({ url: paymentUrl });
// // //   } catch (error) {
// // //     console.error("❌ Payment init error:", error.message);

// // //     return res.status(500).json({
// // //       message: "Payment initiation failed",
// // //       error: error.message,
// // //     });
// // //   }
// // // };


// // // const paymentStatus = async (req, res) => {
// // //   const { product_id, pidx, status } = req.body;
// // //   try {
// // //     const transaction = await Transaction.findOne({
// // //   product_id: String(product_id),
// // // });

// // //     if (!transaction) {
// // //       return res.status(400).json({ message: "Transaction not found" });
// // //     }

// // //     const { payment_gateway } = transaction;

// // //     if (status === "FAILED") {
// // //       await Transaction.updateOne(
// // //         { product_id },
// // //         { $set: { status: "FAILED", updatedAt: new Date() } }
// // //       );

// // //       return res.status(200).json({
// // //         message: "Transaction status updated to FAILED",
// // //         status: "FAILED",
// // //       });
// // //     }

// // //     let paymentStatusCheck;

// // //     if (payment_gateway === "esewa") {
// // //       const paymentData = {
// // //         product_code: process.env.ESEWA_MERCHANT_ID,
// // //         total_amount: transaction.amount,
// // //         transaction_uuid: transaction.product_id,
// // //       };

// // //       const response = await axios.get(
// // //         process.env.ESEWA_PAYMENT_STATUS_CHECK_URL,
// // //         { params: paymentData }
// // //       );

// // //       paymentStatusCheck = response.data;

// // //       if (paymentStatusCheck.status === "COMPLETE") {
// // //         await Transaction.updateOne(
// // //           { product_id },
// // //           { $set: { status: "COMPLETED", updatedAt: new Date() } }
// // //         );

// // //         return res.status(200).json({
// // //           message: "Transaction status updated successfully",
// // //           status: "COMPLETED",
// // //         });
// // //       } else {
// // //         await Transaction.updateOne(
// // //           { product_id },
// // //           { $set: { status: "FAILED", updatedAt: new Date() } }
// // //         );

// // //         return res.status(200).json({
// // //           message: "Transaction status updated to FAILED",
// // //           status: "FAILED",
// // //         });
// // //       }
// // //     }

// // //     if (payment_gateway === "khalti") {
// // //       try {
// // //         const response = await axios.post(
// // //           process.env.KHALTI_VERIFICATION_URL,
// // //           { pidx },
// // //           {
// // //             headers: {
// // //               Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
// // //               "Content-Type": "application/json",
// // //             },
// // //           }
// // //         );

// // //         paymentStatusCheck = response.data;
// // //       } catch (error) {
// // //         if (error.response?.status === 400) {
// // //           paymentStatusCheck = error.response.data;
// // //         } else {
// // //           console.error(
// // //             "Error verifying Khalti payment:",
// // //             error.response?.data || error.message
// // //           );
// // //           throw error;
// // //         }
// // //       }

// // //       if (paymentStatusCheck.status === "Completed") {
// // //         await Transaction.updateOne(
// // //           { product_id },
// // //           { $set: { status: "COMPLETED", updatedAt: new Date() } }
// // //         );

// // //         return res.status(200).json({
// // //           message: "Transaction status updated successfully",
// // //           status: "COMPLETED",
// // //         });
// // //       } else {
// // //         await Transaction.updateOne(
// // //           { product_id },
// // //           { $set: { status: "FAILED", updatedAt: new Date() } }
// // //         );

// // //         return res.status(200).json({
// // //           message: "Transaction status updated to FAILED",
// // //           status: "FAILED",
// // //         });
// // //       }
// // //     }

// // //     return res.status(400).json({ message: "Invalid payment gateway" });
// // //   } catch (error) {
// // //     console.error("Error during payment status check:", error);
// // //     res.status(500).send({
// // //       message: "Payment status check failed",
// // //       error: error.response?.data || error.message,
// // //     });
// // //   }
// // // };

// // // // ✅ CommonJS export
// // // module.exports = { initiatePayment, paymentStatus };


// // const Transaction = require("../models/paymentModel");
// // const { generateHmacSha256Hash } = require("../utils/helper");
// // const axios = require("axios");

// // const initiatePayment = async (req, res) => {
// //   const {
// //     amount,
// //     productId,
// //     paymentGateway,
// //     customerName,
// //     customerEmail,
// //     customerPhone,
// //     productName,
// //   } = req.body;

// //   if (!paymentGateway || !productId) {
// //     return res.status(400).json({ message: "Missing required fields" });
// //   }

// //   try {
// //     // 1️⃣ SAVE TRANSACTION
// //     const transaction = await Transaction.create({
// //       customerDetails: {
// //         name: customerName,
// //         email: customerEmail,
// //         phone: customerPhone,
// //       },
// //       product_name: productName,
// //       product_id: productId,
// //       amount,
// //       payment_gateway: paymentGateway,
// //       status: "PENDING",
// //     });

// //     console.log("✅ Transaction saved:", transaction._id);

// //     let paymentConfig;

// //     if (paymentGateway === "esewa") {
// //       const paymentData = {
// //         amount,
// //         failure_url: process.env.FAILURE_URL,
// //         product_delivery_charge: "0",
// //         product_service_charge: "0",
// //         product_code: process.env.ESEWA_MERCHANT_ID,
// //         signed_field_names: "total_amount,transaction_uuid,product_code",
// //         success_url: process.env.SUCCESS_URL,
// //         tax_amount: "0",
// //         total_amount: amount,
// //         transaction_uuid: transaction._id.toString(), // ✅ UNIQUE ID
// //       };

// //       const data = `total_amount=${paymentData.total_amount},transaction_uuid=${paymentData.transaction_uuid},product_code=${paymentData.product_code}`;
// //       const signature = generateHmacSha256Hash(
// //         data,
// //         process.env.ESEWA_SECRET
// //       );

// //       paymentConfig = {
// //         url: process.env.ESEWA_PAYMENT_URL,
// //         data: { ...paymentData, signature },
// //         headers: { "Content-Type": "application/x-www-form-urlencoded" },
// //         responseHandler: (response) =>
// //           response.request?.res?.responseUrl,
// //       };
// //     }

// //     if (paymentGateway === "khalti") {
// //       paymentConfig = {
// //         url: process.env.KHALTI_PAYMENT_URL,
// //         data: {
// //           amount: amount * 100,
// //           mobile: customerPhone,
// //           product_identity: transaction._id.toString(),
// //           product_name: productName,
// //           return_url: process.env.SUCCESS_URL,
// //           failure_url: process.env.FAILURE_URL,
// //           public_key: process.env.KHALTI_PUBLIC_KEY,
// //           website_url: "http://localhost:5173",
// //           purchase_order_id: transaction._id.toString(),
// //           purchase_order_name: productName,
// //         },
// //         headers: {
// //           Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
// //           "Content-Type": "application/json",
// //         },
// //         responseHandler: (response) => response.data?.payment_url,
// //       };
// //     }

// //     const payment = await axios.post(
// //       paymentConfig.url,
// //       paymentConfig.data,
// //       { headers: paymentConfig.headers }
// //     );

// //     const paymentUrl = paymentConfig.responseHandler(payment);

// //     if (!paymentUrl) {
// //       throw new Error("Payment URL missing");
// //     }

// //     return res.json({ url: paymentUrl });
// //   } catch (error) {
// //     console.error("❌ Payment error:", error.message);
// //     return res.status(500).json({
// //       message: "Payment initiation failed",
// //       error: error.message,
// //     });
// //   }
// // };

// // const paymentStatus = async (req, res) => {
// //   const { product_id, pidx, status } = req.body;

// //   try {
// //     const transaction = await Transaction.findOne({
// //       product_id: String(product_id),
// //     });

// //     if (!transaction) {
// //       return res.status(400).json({ message: "Transaction not found" });
// //     }

// //     const { payment_gateway } = transaction;

// //     if (status === "FAILED") {
// //       await Transaction.updateOne(
// //         { product_id },
// //         { $set: { status: "FAILED", updatedAt: new Date() } }
// //       );

// //       return res.status(200).json({
// //         message: "Transaction status updated to FAILED",
// //         status: "FAILED",
// //       });
// //     }

// //     // ----- ESEWA -----
// //     if (payment_gateway === "esewa") {
// //       const paymentData = {
// //         product_code: process.env.ESEWA_MERCHANT_ID,
// //         total_amount: transaction.amount,
// //         transaction_uuid: transaction.product_id,
// //       };

// //       const response = await axios.get(
// //         process.env.ESEWA_PAYMENT_STATUS_CHECK_URL,
// //         { params: paymentData }
// //       );

// //       if (response.data.status === "COMPLETE") {
// //         await Transaction.updateOne(
// //           { product_id },
// //           { $set: { status: "COMPLETED", updatedAt: new Date() } }
// //         );

// //         return res.json({
// //           message: "Transaction COMPLETED",
// //           status: "COMPLETED",
// //         });
// //       }
// //     }

// //     // ----- KHALTI -----
// //     if (payment_gateway === "khalti") {
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
// //         await Transaction.updateOne(
// //           { product_id },
// //           { $set: { status: "COMPLETED", updatedAt: new Date() } }
// //         );

// //         return res.json({
// //           message: "Transaction COMPLETED",
// //           status: "COMPLETED",
// //         });
// //       }
// //     }

// //     // fallback
// //     await Transaction.updateOne(
// //       { product_id },
// //       { $set: { status: "FAILED", updatedAt: new Date() } }
// //     );

// //     return res.json({
// //       message: "Transaction FAILED",
// //       status: "FAILED",
// //     });
// //   } catch (err) {
// //     console.error("Payment status error:", err);
// //     return res.status(500).json({
// //       message: "Payment status check failed",
// //       error: err.message,
// //     });
// //   }
// // };


// // module.exports = {
// //   initiatePayment,
// //   paymentStatus,
// // };


// const Transaction = require("../models/paymentModel");
// const { generateHmacSha256Hash } = require("../utils/helper");
// const axios = require("axios");

// // ===== Initiate Payment =====
// const initiatePayment = async (req, res) => {
//   const {
//     amount,
//     productId,
//     paymentGateway,
//     customerName,
//     customerEmail,
//     customerPhone,
//     productName,
//     deliveryAddress, // ✅ Added
//   } = req.body;

//   if (!paymentGateway || !productId || !deliveryAddress) {
//     return res.status(400).json({ message: "Missing required fields" });
//   }

//   try {
//     // 1️⃣ Save transaction with delivery address
//     const transaction = await Transaction.create({
//       customerDetails: {
//         name: customerName,
//         email: customerEmail,
//         phone: customerPhone,
//       },
//       product_name: productName,
//       product_id: productId,
//       amount,
//       payment_gateway: paymentGateway,
//       status: "PENDING",
//       deliveryAddress,
//     });

//     console.log("✅ Transaction saved:", transaction._id);

//     let paymentConfig;

//     // ----- ESEWA -----
//     if (paymentGateway === "esewa") {
//       const paymentData = {
//         amount,
//         failure_url: process.env.FAILURE_URL,
//         product_delivery_charge: "0",
//         product_service_charge: "0",
//         product_code: process.env.ESEWA_MERCHANT_ID,
//         signed_field_names: "total_amount,transaction_uuid,product_code",
//         success_url: process.env.SUCCESS_URL,
//         tax_amount: "0",
//         total_amount: amount,
//         transaction_uuid: transaction._id.toString(),
//       };

//       const data = `total_amount=${paymentData.total_amount},transaction_uuid=${paymentData.transaction_uuid},product_code=${paymentData.product_code}`;
//       const signature = generateHmacSha256Hash(data, process.env.ESEWA_SECRET);

//       paymentConfig = {
//         url: process.env.ESEWA_PAYMENT_URL,
//         data: { ...paymentData, signature },
//         headers: { "Content-Type": "application/x-www-form-urlencoded" },
//         responseHandler: (response) => response.request?.res?.responseUrl,
//       };
//     }

//     // ----- KHALTI -----
//     if (paymentGateway === "khalti") {
//       paymentConfig = {
//         url: process.env.KHALTI_PAYMENT_URL,
//         data: {
//           amount: amount * 100,
//           mobile: customerPhone,
//           product_identity: transaction._id.toString(),
//           product_name: productName,
//           return_url: process.env.SUCCESS_URL,
//           failure_url: process.env.FAILURE_URL,
//           public_key: process.env.KHALTI_PUBLIC_KEY,
//           website_url: "http://localhost:5173",
//           purchase_order_id: transaction._id.toString(),
//           purchase_order_name: productName,
//         },
//         headers: {
//           Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
//           "Content-Type": "application/json",
//         },
//         responseHandler: (response) => response.data?.payment_url,
//       };
//     }

//     const payment = await axios.post(paymentConfig.url, paymentConfig.data, {
//       headers: paymentConfig.headers,
//     });

//     const paymentUrl = paymentConfig.responseHandler(payment);

//     if (!paymentUrl) {
//       throw new Error("Payment URL missing");
//     }

//     return res.json({ url: paymentUrl, transactionId: transaction._id });
//   } catch (error) {
//     console.error("❌ Payment error:", error.message);
//     return res.status(500).json({
//       message: "Payment initiation failed",
//       error: error.message,
//     });
//   }
// };

// // ===== Payment Status =====
// const paymentStatus = async (req, res) => {
//   const { product_id, pidx, status } = req.body;

//   try {
//     const transaction = await Transaction.findOne({ product_id: String(product_id) });

//     if (!transaction) {
//       return res.status(400).json({ message: "Transaction not found" });
//     }

//     const { payment_gateway } = transaction;

//     // Handle failed status
//     if (status === "FAILED") {
//       await Transaction.updateOne(
//         { product_id },
//         { $set: { status: "FAILED", updatedAt: new Date() } }
//       );

//       return res.status(200).json({
//         message: "Transaction status updated to FAILED",
//         status: "FAILED",
//         deliveryAddress: transaction.deliveryAddress, // ✅ Include address
//       });
//     }

//     // ----- ESEWA -----
//     if (payment_gateway === "esewa") {
//       const paymentData = {
//         product_code: process.env.ESEWA_MERCHANT_ID,
//         total_amount: transaction.amount,
//         transaction_uuid: transaction.product_id,
//       };

//       const response = await axios.get(process.env.ESEWA_PAYMENT_STATUS_CHECK_URL, {
//         params: paymentData,
//       });

//       if (response.data.status === "COMPLETE") {
//         await Transaction.updateOne(
//           { product_id },
//           { $set: { status: "COMPLETED", updatedAt: new Date() } }
//         );

//         return res.json({
//           message: "Transaction COMPLETED",
//           status: "COMPLETED",
//           deliveryAddress: transaction.deliveryAddress, // ✅ Include address
//         });
//       }
//     }

//     // ----- KHALTI -----
//     if (payment_gateway === "khalti") {
//       const response = await axios.post(
//         process.env.KHALTI_VERIFICATION_URL,
//         { pidx },
//         {
//           headers: {
//             Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.data.status === "Completed") {
//         await Transaction.updateOne(
//           { product_id },
//           { $set: { status: "COMPLETED", updatedAt: new Date() } }
//         );

//         return res.json({
//           message: "Transaction COMPLETED",
//           status: "COMPLETED",
//           deliveryAddress: transaction.deliveryAddress, // ✅ Include address
//         });
//       }
//     }

//     // fallback
//     await Transaction.updateOne(
//       { product_id },
//       { $set: { status: "FAILED", updatedAt: new Date() } }
//     );

//     return res.json({
//       message: "Transaction FAILED",
//       status: "FAILED",
//       deliveryAddress: transaction.deliveryAddress, // ✅ Include address
//     });
//   } catch (err) {
//     console.error("Payment status error:", err);
//     return res.status(500).json({
//       message: "Payment status check failed",
//       error: err.message,
//     });
//   }
// };

// module.exports = {
//   initiatePayment,
//   paymentStatus,
// };



const Transaction = require("../models/paymentModel");
const { generateHmacSha256Hash } = require("../utils/helper");
const axios = require("axios");
const qs = require("querystring"); // ✅ REQUIRED for eSewa form encoding

// ===============================
// INITIATE PAYMENT
// ===============================
const initiatePayment = async (req, res) => {
  const {
    amount,
    productId,
    paymentGateway,
    customerName,
    customerEmail,
    customerPhone,
    productName,
    deliveryAddress,
  } = req.body;

  if (!paymentGateway || !productId || !deliveryAddress) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // 1️⃣ Save transaction in DB
    const transaction = await Transaction.create({
      customerDetails: {
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
      },
      product_name: productName,
      product_id: productId,
      amount,
      payment_gateway: paymentGateway,
      status: "PENDING",
      deliveryAddress,
    });

    console.log("✅ Transaction created:", transaction._id.toString());

    // ===============================
    // ESEWA PAYMENT
    // ===============================
// ===============================
// ESEWA PAYMENT (V2 - SIGNED)
// ===============================
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

  // Create signature
  const dataToSign = `total_amount=${paymentData.total_amount},transaction_uuid=${paymentData.transaction_uuid},product_code=${paymentData.product_code}`;
  const signature = generateHmacSha256Hash(
    dataToSign,
    process.env.ESEWA_SECRET
  );

  paymentData.signature = signature;

  const payment = await axios.post(
    process.env.ESEWA_PAYMENT_URL,
    qs.stringify(paymentData),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      maxRedirects: 0,
      validateStatus: (status) => status >= 200 && status < 400,
    }
  );

  const paymentUrl =
    payment.headers?.location ||
    payment.request?.res?.responseUrl;

  if (!paymentUrl) {
    throw new Error("Payment URL missing from eSewa response");
  }

  return res.json({
    url: paymentUrl,
    transactionId: transaction._id,
  });
}


    // ===============================
    // KHALTI PAYMENT
    // ===============================
    if (paymentGateway === "khalti") {
      const payment = await axios.post(
        process.env.KHALTI_PAYMENT_URL,
        {
          amount: amount * 100, // paisa
          mobile: customerPhone,
          product_identity: transaction._id.toString(),
          product_name: productName,
          return_url: process.env.SUCCESS_URL,
          failure_url: process.env.FAILURE_URL,
          purchase_order_id: transaction._id.toString(),
          purchase_order_name: productName,
          website_url: "http://localhost:5173",
        },
        {
          headers: {
            Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const paymentUrl = payment.data?.payment_url;

      if (!paymentUrl) {
        throw new Error("Payment URL missing from Khalti response");
      }

      return res.json({
        url: paymentUrl,
        transactionId: transaction._id,
      });
    }

    return res.status(400).json({ message: "Invalid payment gateway" });
  } catch (error) {
    console.error("❌ Payment initiation error:", error.message);
    return res.status(500).json({
      message: "Payment initiation failed",
      error: error.message,
    });
  }
};

// ===============================
// PAYMENT STATUS CHECK
// ===============================
const paymentStatus = async (req, res) => {
  const { product_id, pidx, status } = req.body;

  try {
    // Find transaction by MongoDB ID
    const transaction = await Transaction.findById(product_id);

    if (!transaction) {
      return res.status(400).json({ message: "Transaction not found" });
    }

    // Client says failed
    if (status === "FAILED") {
      transaction.status = "FAILED";
      await transaction.save();

      return res.json({
        message: "FAILED",
        status: "FAILED",
        deliveryAddress: transaction.deliveryAddress,
      });
    }

    // ===============================
    // ESEWA STATUS CHECK
    // ===============================
    if (transaction.payment_gateway === "esewa") {
      const response = await axios.get(
        process.env.ESEWA_PAYMENT_STATUS_CHECK_URL,
        {
          params: {
            product_code: process.env.ESEWA_MERCHANT_ID,
            total_amount: transaction.amount,
            transaction_uuid: transaction._id.toString(),
          },
        }
      );

      if (response.data.status === "COMPLETE") {
        transaction.status = "COMPLETED";
        await transaction.save();

        return res.json({
          message: "COMPLETED",
          status: "COMPLETED",
          deliveryAddress: transaction.deliveryAddress,
        });
      }
    }

    // ===============================
    // KHALTI STATUS CHECK
    // ===============================
    if (transaction.payment_gateway === "khalti") {
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

      if (response.data.status === "Completed") {
        transaction.status = "COMPLETED";
        await transaction.save();

        return res.json({
          message: "COMPLETED",
          status: "COMPLETED",
          deliveryAddress: transaction.deliveryAddress,
        });
      }
    }

    // ===============================
    // FALLBACK = FAILED
    // ===============================
    transaction.status = "FAILED";
    await transaction.save();

    return res.json({
      message: "FAILED",
      status: "FAILED",
      deliveryAddress: transaction.deliveryAddress,
    });
  } catch (err) {
    console.error("❌ Payment status error:", err.message);
    return res.status(500).json({
      message: "Payment status check failed",
      error: err.message,
    });
  }
};

module.exports = {
  initiatePayment,
  paymentStatus,
};

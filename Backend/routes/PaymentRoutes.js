// // const express = require("express");
// // const auth = require("../middleware/auth");

// // const {
// //   initiatePayment,
// //   paymentStatus,
// // } = require("../controllers/PaymentController");

// // const router = express.Router();

// // router.post("/initiate-payment", auth, initiatePayment);
// // router.post("/payment-status", paymentStatus);

// // module.exports = router;


// const express = require("express");
// const auth = require("../middleware/auth");

// const {
//   initiatePayment,
//   paymentStatus,
//   initiateCashOnDeliveryPayment,
// } = require("../controllers/PaymentController");

// const router = express.Router();

// router.post("/initiate-payment", auth, initiatePayment);
// router.post(
//   "/initiate-cash-on-delivery-payment",
//   auth,
//   initiateCashOnDeliveryPayment
// );
// router.post("/payment-status", paymentStatus);

// module.exports = router;


const express = require("express");
const auth = require("../middleware/auth");

const {
  initiatePayment,
  paymentStatus,
  initiateCashOnDeliveryPayment,
  markCodPaid, // <-- new handler
} = require("../controllers/PaymentController");

const router = express.Router();

router.post("/initiate-payment", auth, initiatePayment);
router.post(
  "/initiate-cash-on-delivery-payment",
  auth,
  initiateCashOnDeliveryPayment
);

// Mark COD payment as collected & finalize order
// Example: POST /api/payment/mark-cod-paid/605c2f0b1a2b3c4d5e6f7a8b
router.post("/mark-cod-paid/:transactionId", auth, markCodPaid);

router.post("/payment-status", paymentStatus);

module.exports = router;

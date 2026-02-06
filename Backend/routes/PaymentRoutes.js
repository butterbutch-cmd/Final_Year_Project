const express = require("express");
const auth = require("../middleware/auth");

const {
  initiatePayment,
  paymentStatus,
} = require("../controllers/PaymentController");

const router = express.Router();

router.post("/initiate-payment", auth, initiatePayment);
router.post("/payment-status", paymentStatus);

module.exports = router;

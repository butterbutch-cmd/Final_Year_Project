const router = require("express").Router();
const auth = require("../middleware/auth");
const checkPermission = require("../middleware/checkPermission");

const controller = require("../controllers/adminPaymentController");

router.use(auth, checkPermission("payments", "view"));

router.get("/", checkPermission("payments", "view"), controller.getAllPayments);
router.get("/:id", checkPermission("payments","view"), controller.getPaymentById);
router.patch("/:id/status", checkPermission("payments", "edit"), controller.updatePaymentStatus);
router.patch("/:id/delivery-status", checkPermission("payments", "edit"), controller.updateDeliveryStatus);
router.post("/:id/refund", checkPermission("payments", "edit"), controller.refundPayment);

module.exports = router;

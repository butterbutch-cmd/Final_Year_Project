// const express = require("express");
// const router = express.Router();

// const {
//   getReviewsByProduct,
//   createReview,
// } = require("../controllers/reviewController");

// const auth = require("../middleware/auth");

// /* ================= PUBLIC ================= */
// router.get("/:productId", getReviewsByProduct);

// /* ================= PROTECTED ================= */
// router.post("/", auth, createReview);

// module.exports = router;

///file: Final_Year_Project/Backend/routes/reviewRoutes.js
const express = require("express");
const router = express.Router();

const {
  getReviewsByProduct,
  createReview,
  reportReview,
} = require("../controllers/reviewController");

const auth = require("../middleware/auth");

/* ================= PUBLIC ================= */
router.get("/:productId", getReviewsByProduct);

/* ================= PROTECTED ================= */
router.post("/", auth, createReview);
router.post("/:reviewId/report", auth, reportReview);

module.exports = router;

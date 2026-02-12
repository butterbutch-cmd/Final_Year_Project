// // file: routes/adminReportRoutes.js
// const express = require("express");
// const router = express.Router();

// const {
//   getReportedReviews,
//   getReviewReports,
//   getReviewProduct,
// } = require("../controllers/adminReportController");

// const auth = require("../middleware/auth");
// const checkPermission = require("../middleware/checkPermission");

// /* ================= ADMIN REPORT ROUTES ================= */

// router.get(
//   "/reports",
//   auth,
// //   checkPermission("reviews", "read"),
//   getReportedReviews
// );

// router.get(
//   "/reports/:reviewId",
//   auth,
// //   checkPermission("reviews", "read"),
//   getReviewReports
// );

// router.get(
//   "/reports/:reviewId/product",
//   auth,
//     //   checkPermission("reviews", "read"),
//   getReviewProduct
// );

// module.exports = router;


// file: routes/adminReportRoutes.js
const express = require("express");
const router = express.Router();

const {
  getReportedReviews,
  getReviewReports,
  getReviewProduct,
  deleteReview, // ✅ added
} = require("../controllers/adminReportController");

const auth = require("../middleware/auth");
const checkPermission = require("../middleware/checkPermission");

/* ================= ADMIN REPORT ROUTES ================= */

// Get all reported reviews
router.get(
  "/reports",
  auth,

  getReportedReviews
);

// Get specific review + reports
router.get(
  "/reports/:reviewId",
  auth,
  checkPermission("reviews", "view"),
  getReviewReports
);

// Get product linked to review
router.get(
  "/reports/:reviewId/product",
  auth,
  checkPermission("reviews", "edit"),
  getReviewProduct
);

// ✅ DELETE REVIEW (ADMIN)
router.delete(
  "/reviews/:reviewId",
  auth,
  checkPermission("reviews", "delete"),
  deleteReview
);

module.exports = router;

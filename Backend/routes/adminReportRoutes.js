// file: routes/adminReportRoutes.js
const express = require("express");
const router = express.Router();

const {
  getReportedReviews,
  getReviewReports,
  getReviewProduct,
  deleteReview, // ✅ added
} = require("../controllers/adminReportController");

const auth = require("../middleware/auth"); /// changed from authenticate to auth for consistency
const checkPermission = require("../middleware/checkPermission");/// added for permission checks

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
  checkPermission("content", "view"),
  getReviewReports
);

// Get product linked to review
router.get(
  "/reports/:reviewId/product",
  auth,
  checkPermission("content", "edit"),
  getReviewProduct
);

// ✅ DELETE REVIEW (ADMIN)
router.delete(
  "/reviews/:reviewId",
  auth,
  checkPermission("content", "delete"),
  deleteReview
);

module.exports = router;

// Backend/routes/adminDashboardRoutes.js
const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/adminAuth");
const {
  getSummary,
  getRevenueMonthly,
  getOrdersTrend,
  getPaymentMethods,
  getDeliveryStatus,
  getTopProducts,
  getRecentTransactions,
  getUserGrowth,
  getLowStock,
} = require("../controllers/adminDashboardController");

// Apply adminAuth to all dashboard routes
router.use(adminAuth);

/**
 * @route   GET /api/admin/dashboard/summary
 * @desc    KPI cards: total revenue, orders, status breakdown
 * @access  Admin / Super Admin
 */
router.get("/summary", getSummary);

/**
 * @route   GET /api/admin/dashboard/revenue-monthly
 * @desc    Monthly revenue & order count for a given year
 * @query   year (optional, defaults to current year)
 * @access  Admin / Super Admin
 */
router.get("/revenue-monthly", getRevenueMonthly);

/**
 * @route   GET /api/admin/dashboard/orders-trend
 * @desc    Daily orders & revenue over the last N days
 * @query   days (optional, default 30)
 * @access  Admin / Super Admin
 */
router.get("/orders-trend", getOrdersTrend);

/**
 * @route   GET /api/admin/dashboard/payment-methods
 * @desc    Breakdown by payment gateway (esewa, khalti, cod)
 * @access  Admin / Super Admin
 */
router.get("/payment-methods", getPaymentMethods);

/**
 * @route   GET /api/admin/dashboard/delivery-status
 * @desc    Breakdown by delivery status
 * @access  Admin / Super Admin
 */
router.get("/delivery-status", getDeliveryStatus);

/**
 * @route   GET /api/admin/dashboard/top-products
 * @desc    Top selling products by revenue
 * @query   limit (optional, default 5, max 20)
 * @access  Admin / Super Admin
 */
router.get("/top-products", getTopProducts);

/**
 * @route   GET /api/admin/dashboard/recent-transactions
 * @desc    Paginated recent transactions
 * @query   page (default 1), limit (default 10)
 * @access  Admin / Super Admin
 */
router.get("/recent-transactions", getRecentTransactions);

/**
 * @route   GET /api/admin/dashboard/user-growth
 * @desc    New user registrations per month (current year)
 * @access  Admin / Super Admin
 */
router.get("/user-growth", getUserGrowth);

/**
 * @route   GET /api/admin/dashboard/low-stock
 * @desc    Products at or below stock threshold
 * @query   threshold (optional, default 5)
 * @access  Admin / Super Admin
 */
router.get("/low-stock", getLowStock);

module.exports = router;
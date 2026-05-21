// Backend/controllers/adminDashboardController.js
const {
  getSummaryData,
  getMonthlyRevenueData,
  getOrdersTrendData,
  getPaymentMethodsData,
  getDeliveryStatusData,
  getTopProductsData,
  getRecentTransactionsData,
  getUserGrowthData,
  getLowStockData,
} = require("../utils/dashboardHelpers");

/* ─────────────────────────────────────────────
   GET /api/admin/dashboard/summary
   ───────────────────────────────────────────── */
const getSummary = async (req, res) => {
  try {
    const data = await getSummaryData();
    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("Dashboard summary error:", err);
    res.status(500).json({ success: false, message: "Failed to load summary." });
  }
};

/* ─────────────────────────────────────────────
   GET /api/admin/dashboard/revenue-monthly
   Query: ?year=2024
   ───────────────────────────────────────────── */
const getRevenueMonthly = async (req, res) => {
  try {
    const { year } = req.query;
    const data = await getMonthlyRevenueData(year);
    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("Monthly revenue error:", err);
    res.status(500).json({ success: false, message: "Failed to load monthly revenue." });
  }
};

/* ─────────────────────────────────────────────
   GET /api/admin/dashboard/orders-trend
   Query: ?days=30
   ───────────────────────────────────────────── */
const getOrdersTrend = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const data = await getOrdersTrendData(days);
    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("Orders trend error:", err);
    res.status(500).json({ success: false, message: "Failed to load orders trend." });
  }
};

/* ─────────────────────────────────────────────
   GET /api/admin/dashboard/payment-methods
   ───────────────────────────────────────────── */
const getPaymentMethods = async (req, res) => {
  try {
    const data = await getPaymentMethodsData();
    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("Payment methods error:", err);
    res.status(500).json({ success: false, message: "Failed to load payment methods." });
  }
};

/* ─────────────────────────────────────────────
   GET /api/admin/dashboard/delivery-status
   ───────────────────────────────────────────── */
const getDeliveryStatus = async (req, res) => {
  try {
    const data = await getDeliveryStatusData();
    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("Delivery status error:", err);
    res.status(500).json({ success: false, message: "Failed to load delivery status." });
  }
};

/* ─────────────────────────────────────────────
   GET /api/admin/dashboard/top-products
   Query: ?limit=5
   ───────────────────────────────────────────── */
const getTopProducts = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 5, 20);
    const data = await getTopProductsData(limit);
    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("Top products error:", err);
    res.status(500).json({ success: false, message: "Failed to load top products." });
  }
};

/* ─────────────────────────────────────────────
   GET /api/admin/dashboard/recent-transactions
   Query: ?page=1&limit=10
   ───────────────────────────────────────────── */
const getRecentTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const data = await getRecentTransactionsData(page, limit);
    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("Recent transactions error:", err);
    res.status(500).json({ success: false, message: "Failed to load recent transactions." });
  }
};

/* ─────────────────────────────────────────────
   GET /api/admin/dashboard/user-growth
   ───────────────────────────────────────────── */
const getUserGrowth = async (req, res) => {
  try {
    const data = await getUserGrowthData();
    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("User growth error:", err);
    res.status(500).json({ success: false, message: "Failed to load user growth." });
  }
};

/* ─────────────────────────────────────────────
   GET /api/admin/dashboard/low-stock
   Query: ?threshold=5
   ───────────────────────────────────────────── */
const getLowStock = async (req, res) => {
  try {
    const threshold = parseInt(req.query.threshold) || 5;
    const data = await getLowStockData(threshold);
    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("Low stock error:", err);
    res.status(500).json({ success: false, message: "Failed to load low stock data." });
  }
};

module.exports = {
  getSummary,
  getRevenueMonthly,
  getOrdersTrend,
  getPaymentMethods,
  getDeliveryStatus,
  getTopProducts,
  getRecentTransactions,
  getUserGrowth,
  getLowStock,
};
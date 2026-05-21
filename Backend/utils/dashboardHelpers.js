// Backend/utils/dashboardHelpers.js
const Transaction = require("../models/paymentModel");
const { User } = require("../models/User");
const Product = require("../models/Product");

/* ─────────────────────────────────────────────
   SUMMARY: KPI cards data
   ───────────────────────────────────────────── */
const getSummaryData = async () => {
  const [statusBreakdown, totals] = await Promise.all([
    Transaction.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          revenue: { $sum: "$amount" },
        },
      },
    ]),
    Transaction.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" },
          totalOrders: { $sum: 1 },
          completedRevenue: {
            $sum: {
              $cond: [{ $eq: ["$status", "COMPLETED"] }, "$amount", 0],
            },
          },
        },
      },
    ]),
  ]);

  const statusMap = {};
  statusBreakdown.forEach(({ _id, count, revenue }) => {
    statusMap[_id] = { count, revenue };
  });

  const base = totals[0] || {
    totalRevenue: 0,
    totalOrders: 0,
    completedRevenue: 0,
  };

  return {
    totalRevenue: base.totalRevenue,
    completedRevenue: base.completedRevenue,
    totalOrders: base.totalOrders,
    completed: statusMap["COMPLETED"]?.count || 0,
    pending: statusMap["PENDING"]?.count || 0,
    failed: statusMap["FAILED"]?.count || 0,
    refunded: statusMap["REFUNDED"]?.count || 0,
    cancelled: statusMap["CANCELLED"]?.count || 0,
  };
};

/* ─────────────────────────────────────────────
   MONTHLY REVENUE: bar/line chart data
   ───────────────────────────────────────────── */
const getMonthlyRevenueData = async (year) => {
  const targetYear = parseInt(year) || new Date().getFullYear();

  const result = await Transaction.aggregate([
    {
      $match: {
        status: "COMPLETED",
        createdAt: {
          $gte: new Date(`${targetYear}-01-01`),
          $lt: new Date(`${targetYear + 1}-01-01`),
        },
      },
    },
    {
      $group: {
        _id: { month: { $month: "$createdAt" } },
        revenue: { $sum: "$amount" },
        orders: { $sum: 1 },
      },
    },
    { $sort: { "_id.month": 1 } },
  ]);

  const MONTHS = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  // Fill all 12 months, missing ones get 0
  const monthlyData = MONTHS.map((name, idx) => {
    const found = result.find((r) => r._id.month === idx + 1);
    return {
      month: name,
      revenue: found?.revenue || 0,
      orders: found?.orders || 0,
    };
  });

  return monthlyData;
};

/* ─────────────────────────────────────────────
   ORDERS TREND: last N days (daily count)
   ───────────────────────────────────────────── */
const getOrdersTrendData = async (days = 30) => {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const result = await Transaction.aggregate([
    { $match: { createdAt: { $gte: since } } },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          day: { $dayOfMonth: "$createdAt" },
        },
        orders: { $sum: 1 },
        revenue: { $sum: "$amount" },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
  ]);

  return result.map(({ _id, orders, revenue }) => ({
    date: `${_id.year}-${String(_id.month).padStart(2, "0")}-${String(_id.day).padStart(2, "0")}`,
    orders,
    revenue,
  }));
};

/* ─────────────────────────────────────────────
   PAYMENT METHODS breakdown
   ───────────────────────────────────────────── */
const getPaymentMethodsData = async () => {
  const result = await Transaction.aggregate([
    {
      $group: {
        _id: "$payment_gateway",
        count: { $sum: 1 },
        revenue: { $sum: "$amount" },
      },
    },
    { $sort: { revenue: -1 } },
  ]);

  const LABELS = { esewa: "eSewa", khalti: "Khalti", cod: "Cash on Delivery" };

  return result.map(({ _id, count, revenue }) => ({
    name: LABELS[_id] || _id,
    key: _id,
    count,
    revenue,
  }));
};

/* ─────────────────────────────────────────────
   DELIVERY STATUS breakdown
   ───────────────────────────────────────────── */
const getDeliveryStatusData = async () => {
  const result = await Transaction.aggregate([
    {
      $group: {
        _id: "$deliveryStatus",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
  ]);

  return result.map(({ _id, count }) => ({
    name: _id,
    count,
  }));
};

/* ─────────────────────────────────────────────
   TOP PRODUCTS by revenue & quantity sold
   ───────────────────────────────────────────── */
const getTopProductsData = async (limit = 5) => {
  const result = await Transaction.aggregate([
    { $match: { status: "COMPLETED" } },
    { $unwind: "$cartItems" },
    {
      $group: {
        _id: "$cartItems.productId",
        name: { $first: "$cartItems.name" },
        totalSold: { $sum: "$cartItems.quantity" },
        totalRevenue: {
          $sum: { $multiply: ["$cartItems.price", "$cartItems.quantity"] },
        },
      },
    },
    { $sort: { totalRevenue: -1 } },
    { $limit: parseInt(limit) },
  ]);

  return result.map(({ _id, name, totalSold, totalRevenue }) => ({
    productId: _id,
    name,
    totalSold,
    totalRevenue,
  }));
};

/* ─────────────────────────────────────────────
   RECENT TRANSACTIONS (paginated)
   ───────────────────────────────────────────── */
const getRecentTransactionsData = async (page = 1, limit = 10) => {
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [transactions, total] = await Promise.all([
    Transaction.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select(
        "customerDetails.name customerDetails.email amount payment_gateway status deliveryStatus createdAt"
      )
      .lean(),
    Transaction.countDocuments(),
  ]);

  return {
    transactions,
    total,
    page: parseInt(page),
    totalPages: Math.ceil(total / parseInt(limit)),
  };
};

/* ─────────────────────────────────────────────
   USER GROWTH: new users per month (current year)
   ───────────────────────────────────────────── */
const getUserGrowthData = async () => {
  const year = new Date().getFullYear();

  const result = await User.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(`${year}-01-01`),
          $lt: new Date(`${year + 1}-01-01`),
        },
      },
    },
    {
      $group: {
        _id: { month: { $month: "$createdAt" } },
        newUsers: { $sum: 1 },
      },
    },
    { $sort: { "_id.month": 1 } },
  ]);

  const MONTHS = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  return MONTHS.map((name, idx) => {
    const found = result.find((r) => r._id.month === idx + 1);
    return { month: name, newUsers: found?.newUsers || 0 };
  });
};

/* ─────────────────────────────────────────────
   LOW STOCK: products at or below threshold
   ───────────────────────────────────────────── */
const getLowStockData = async (threshold = 5) => {
  const products = await Product.find({ stock: { $lte: parseInt(threshold) } })
    .select("name category stock price image1")
    .sort({ stock: 1 })
    .lean();

  return products.map((p) => ({
    _id: p._id,
    name: p.name,
    category: p.category,
    stock: p.stock,
    price: p.price,
    image: p.image1 || null,
  }));
};

module.exports = {
  getSummaryData,
  getMonthlyRevenueData,
  getOrdersTrendData,
  getPaymentMethodsData,
  getDeliveryStatusData,
  getTopProductsData,
  getRecentTransactionsData,
  getUserGrowthData,
  getLowStockData,
};
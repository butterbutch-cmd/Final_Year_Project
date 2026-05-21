// src/admin/services/dashboardService.js
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const DASHBOARD_URL = `${API_BASE}/api/admin/dashboard`;

/**
 * Retrieves the stored auth token from localStorage.
 * Checks multiple keys to stay compatible with your existing auth flow.
 */
const getAuthHeader = () => {
  const token =
    localStorage.getItem("adminToken") ||
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const get = (path, params = {}) =>
  axios.get(`${DASHBOARD_URL}${path}`, {
    params,
    headers: getAuthHeader(),
  });

const dashboardService = {
  /** KPI summary cards */
  getSummary: () => get("/summary"),

  /**
   * Monthly revenue bar chart
   * @param {number} year - defaults to current year
   */
  getRevenueMonthly: (year = new Date().getFullYear()) =>
    get("/revenue-monthly", { year }),

  /**
   * Daily orders/revenue trend line chart
   * @param {number} days - lookback window (default 30)
   */
  getOrdersTrend: (days = 30) => get("/orders-trend", { days }),

  /** Payment gateway pie chart */
  getPaymentMethods: () => get("/payment-methods"),

  /** Delivery status pie chart */
  getDeliveryStatus: () => get("/delivery-status"),

  /**
   * Top selling products bar chart
   * @param {number} limit - max results (default 5)
   */
  getTopProducts: (limit = 5) => get("/top-products", { limit }),

  /**
   * Recent transactions table
   * @param {number} page
   * @param {number} limit
   */
  getRecentTransactions: (page = 1, limit = 10) =>
    get("/recent-transactions", { page, limit }),

  /** Monthly new user registrations */
  getUserGrowth: () => get("/user-growth"),

  /**
   * Low stock products list
   * @param {number} threshold - stock level cutoff (default 5)
   */
  getLowStock: (threshold = 5) => get("/low-stock", { threshold }),
};

export default dashboardService;
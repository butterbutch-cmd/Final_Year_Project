// src/admin/pages/AdminHome.jsx
import { useState, useCallback } from "react";
import dashboardService from "../services/dashboardService";
import usePolling from "../hooks/usePolling";

import RevenueChart           from "../components/charts/RevenueChart";
import OrdersTrendChart       from "../components/charts/OrdersTrendChart";
import PaymentMethodChart     from "../components/charts/PaymentMethodChart";
import DeliveryStatusChart    from "../components/charts/DeliveryStatusChart";
import TopProductsChart       from "../components/charts/TopProductsChart";
import UserGrowthChart        from "../components/charts/UserGrowthChart";
import RecentTransactionsTable from "../components/RecentTransactionsTable";
import LowStockAlert          from "../components/LowStockAlert";

/* ─── helpers ─────────────────────────────────────────── */
const fmt = (n) =>
  n >= 1_000_000
    ? `Rs. ${(n / 1_000_000).toFixed(2)}M`
    : n >= 1_000
    ? `Rs. ${(n / 1_000).toFixed(1)}k`
    : `Rs. ${n ?? 0}`;

const POLL_INTERVAL = 30_000; // 30 seconds

/* ─── tiny KPI card ──────────────────────────────────── */
const KpiCard = ({ label, value, sub, icon, accent }) => (
  <div className="kpi-card" style={{ borderTopColor: accent }}>
    <div className="kpi-icon" style={{ background: `${accent}1a`, color: accent }}>
      {icon}
    </div>
    <div>
      <p className="kpi-label">{label}</p>
      <p className="kpi-value">{value}</p>
      {sub && <p className="kpi-sub">{sub}</p>}
    </div>
  </div>
);

/* ─── section wrapper ────────────────────────────────── */
const ChartCard = ({ title, action, children }) => (
  <div className="chart-card">
    <div className="chart-card-header">
      <h3 className="chart-title">{title}</h3>
      {action}
    </div>
    {children}
  </div>
);

/* ═══════════════════════════════════════════════════════
   ADMIN HOME
═══════════════════════════════════════════════════════ */
const AdminHome = () => {
  /* ── state ── */
  const [summary, setSummary]     = useState(null);
  const [revenue, setRevenue]     = useState([]);
  const [trend, setTrend]         = useState([]);
  const [payments, setPayments]   = useState([]);
  const [delivery, setDelivery]   = useState([]);
  const [topProd, setTopProd]     = useState([]);
  const [userGrowth, setUserGrowth] = useState([]);
  const [lowStock, setLowStock]   = useState([]);
  const [txData, setTxData]       = useState({
    transactions: [], total: 0, page: 1, totalPages: 1,
  });

  const [loading, setLoading]     = useState(true);
  const [txLoading, setTxLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [trendDays, setTrendDays] = useState(30);
  const [revenueYear, setRevenueYear] = useState(new Date().getFullYear());
  const [txPage, setTxPage]       = useState(1);
  const [error, setError]         = useState(null);

  /* ── polling fetch ── */
  const fetchAll = useCallback(async () => {
    try {
      setError(null);
      const [
        sumRes, revRes, trendRes, payRes,
        delRes, topRes, ugRes, lsRes,
      ] = await Promise.all([
        dashboardService.getSummary(),
        dashboardService.getRevenueMonthly(revenueYear),
        dashboardService.getOrdersTrend(trendDays),
        dashboardService.getPaymentMethods(),
        dashboardService.getDeliveryStatus(),
        dashboardService.getTopProducts(6),
        dashboardService.getUserGrowth(),
        dashboardService.getLowStock(5),
      ]);

      setSummary(sumRes.data.data);
      setRevenue(revRes.data.data);
      setTrend(trendRes.data.data);
      setPayments(payRes.data.data);
      setDelivery(delRes.data.data);
      setTopProd(topRes.data.data);
      setUserGrowth(ugRes.data.data);
      setLowStock(lsRes.data.data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError("Failed to load dashboard data. Retrying…");
    } finally {
      setLoading(false);
    }
  }, [revenueYear, trendDays]);

  usePolling(fetchAll, POLL_INTERVAL);

  /* ── fetch transactions separately (pagination) ── */
  const fetchTransactions = useCallback(async (page = 1) => {
    setTxLoading(true);
    try {
      const res = await dashboardService.getRecentTransactions(page, 10);
      setTxData(res.data.data);
      setTxPage(page);
    } catch (err) {
      console.error("Transactions fetch error:", err);
    } finally {
      setTxLoading(false);
    }
  }, []);

  // Initial transaction load
  usePolling(fetchTransactions, POLL_INTERVAL);

  /* ── derived values ── */
  const completionRate = summary
    ? ((summary.completed / (summary.totalOrders || 1)) * 100).toFixed(1)
    : 0;

  /* ── render ── */
  return (
    <div className="admin-home">

      {/* ── top bar ── */}
      <div className="dash-topbar">
        <div>
          <h2 className="dash-title">Dashboard Overview</h2>
          <p className="dash-subtitle">
            {lastUpdated
              ? `Last updated: ${lastUpdated.toLocaleTimeString()}`
              : "Loading…"}
          </p>
        </div>
        <div className="dash-topbar-actions">
          {error && (
            <span className="dash-error-badge">{error}</span>
          )}
          <div className="year-selector">
            <label>Year</label>
            <select
              value={revenueYear}
              onChange={(e) => setRevenueYear(Number(e.target.value))}
            >
              {[2023, 2024, 2025, 2026].map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ── KPI CARDS ── */}
      <div className="kpi-grid">
        <KpiCard
          label="Total Revenue"
          value={fmt(summary?.totalRevenue)}
          sub={`Completed: ${fmt(summary?.completedRevenue)}`}
          icon="💰"
          accent="#22c55e"
        />
        <KpiCard
          label="Total Orders"
          value={summary?.totalOrders ?? "—"}
          sub={`Completion rate: ${completionRate}%`}
          icon="📦"
          accent="#3b82f6"
        />
        <KpiCard
          label="Completed"
          value={summary?.completed ?? "—"}
          sub="Successfully fulfilled"
          icon="✅"
          accent="#10b981"
        />
        <KpiCard
          label="Pending"
          value={summary?.pending ?? "—"}
          sub={`Failed: ${summary?.failed ?? 0} · Cancelled: ${summary?.cancelled ?? 0}`}
          icon="⏳"
          accent="#f59e0b"
        />
      </div>

      {/* ── ROW 2: Revenue chart + Orders trend ── */}
      <div className="chart-row-2">
        <ChartCard
          title={`Monthly Revenue — ${revenueYear}`}
          action={
            <span className="chart-badge green">Completed only</span>
          }
        >
          <RevenueChart data={revenue} loading={loading} />
        </ChartCard>

        <ChartCard
          title="Orders Trend"
          action={
            <div className="trend-selector">
              {[7, 14, 30, 60].map((d) => (
                <button
                  key={d}
                  className={`trend-btn ${trendDays === d ? "active" : ""}`}
                  onClick={() => setTrendDays(d)}
                >
                  {d}d
                </button>
              ))}
            </div>
          }
        >
          <OrdersTrendChart data={trend} loading={loading} />
        </ChartCard>
      </div>

      {/* ── ROW 3: Payment methods + Delivery status ── */}
      <div className="chart-row-2">
        <ChartCard title="Payment Gateway Breakdown">
          <PaymentMethodChart data={payments} loading={loading} />
        </ChartCard>

        <ChartCard title="Delivery Status Breakdown">
          <DeliveryStatusChart data={delivery} loading={loading} />
        </ChartCard>
      </div>

      {/* ── ROW 4: Top products + User growth ── */}
      <div className="chart-row-2">
        <ChartCard title="Top Selling Products" action={
          <span className="chart-badge green">By revenue</span>
        }>
          <TopProductsChart data={topProd} loading={loading} />
        </ChartCard>

        <ChartCard title={`User Growth — ${new Date().getFullYear()}`}>
          <UserGrowthChart data={userGrowth} loading={loading} />
        </ChartCard>
      </div>

      {/* ── RECENT TRANSACTIONS ── */}
      <ChartCard
        title="Recent Transactions"
        action={
          <span className="chart-badge blue">
            {txData.total} total
          </span>
        }
      >
        <RecentTransactionsTable
          transactions={txData.transactions}
          total={txData.total}
          page={txPage}
          totalPages={txData.totalPages}
          onPageChange={fetchTransactions}
          loading={txLoading}
        />
      </ChartCard>

      {/* ── LOW STOCK ALERT ── */}
      <ChartCard
        title="Low Stock Alerts"
        action={
          lowStock.length > 0 && (
            <span className="chart-badge red">
              {lowStock.length} item{lowStock.length !== 1 ? "s" : ""} need attention
            </span>
          )
        }
      >
        <LowStockAlert items={lowStock} loading={loading} />
      </ChartCard>

      {/* ── INLINE STYLES ── */}
      <style>{`
        /* ── layout ── */
        .admin-home {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          background: #f9fafb;
          min-height: 100vh;
          font-family: inherit;
        }

        /* ── top bar ── */
        .dash-topbar {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }
        .dash-title {
          font-size: 22px;
          font-weight: 700;
          color: #111827;
          margin: 0;
        }
        .dash-subtitle {
          font-size: 13px;
          color: #9ca3af;
          margin: 4px 0 0;
        }
        .dash-topbar-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        .dash-error-badge {
          background: #fee2e2;
          color: #b91c1c;
          padding: 4px 12px;
          border-radius: 6px;
          font-size: 12px;
        }

        /* ── year selector ── */
        .year-selector {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #374151;
        }
        .year-selector select {
          border: 1px solid #d1d5db;
          border-radius: 6px;
          padding: 4px 8px;
          font-size: 13px;
          background: #fff;
          cursor: pointer;
          outline: none;
        }

        /* ── KPI grid ── */
        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
        @media (max-width: 1024px) {
          .kpi-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .kpi-grid { grid-template-columns: 1fr; }
        }

        /* ── KPI card ── */
        .kpi-card {
          background: #fff;
          border-radius: 12px;
          padding: 20px;
          display: flex;
          align-items: flex-start;
          gap: 16px;
          border-top: 3px solid transparent;
          box-shadow: 0 1px 4px rgba(0,0,0,0.06);
          transition: box-shadow 0.2s;
        }
        .kpi-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .kpi-icon {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          flex-shrink: 0;
        }
        .kpi-label {
          font-size: 12px;
          color: #6b7280;
          font-weight: 500;
          margin: 0 0 4px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .kpi-value {
          font-size: 22px;
          font-weight: 700;
          color: #111827;
          margin: 0 0 2px;
          line-height: 1;
        }
        .kpi-sub {
          font-size: 12px;
          color: #9ca3af;
          margin: 0;
        }

        /* ── chart rows ── */
        .chart-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        @media (max-width: 900px) {
          .chart-row-2 { grid-template-columns: 1fr; }
        }

        /* ── chart card ── */
        .chart-card {
          background: #fff;
          border-radius: 12px;
          padding: 20px 24px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.06);
        }
        .chart-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
          flex-wrap: wrap;
          gap: 8px;
        }
        .chart-title {
          font-size: 15px;
          font-weight: 600;
          color: #111827;
          margin: 0;
        }

        /* ── chart util ── */
        .chart-skeleton {
          height: 240px;
          background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
          border-radius: 8px;
        }
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .chart-empty {
          text-align: center;
          color: #9ca3af;
          padding: 40px 0;
          margin: 0;
        }

        /* ── badges ── */
        .chart-badge {
          font-size: 11px;
          font-weight: 600;
          padding: 3px 10px;
          border-radius: 9999px;
        }
        .chart-badge.green { background: #dcfce7; color: #15803d; }
        .chart-badge.blue  { background: #dbeafe; color: #1d4ed8; }
        .chart-badge.red   { background: #fee2e2; color: #b91c1c; }

        /* ── trend selector ── */
        .trend-selector { display: flex; gap: 4px; }
        .trend-btn {
          border: 1px solid #e5e7eb;
          background: #fff;
          border-radius: 6px;
          padding: 3px 10px;
          font-size: 12px;
          cursor: pointer;
          color: #374151;
          transition: all 0.15s;
        }
        .trend-btn:hover { border-color: #22c55e; color: #22c55e; }
        .trend-btn.active {
          background: #22c55e;
          color: #fff;
          border-color: #22c55e;
        }

        /* ── tooltip ── */
        .dashboard-tooltip {
          background: #1f2937;
          color: #f9fafb;
          padding: 10px 14px;
          border-radius: 8px;
          font-size: 12px;
          line-height: 1.6;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
        .tooltip-label {
          font-weight: 600;
          margin: 0 0 4px;
          color: #d1fae5;
        }
        .dashboard-tooltip p { margin: 0; }

        /* ── transactions table ── */
        .dash-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }
        .dash-table th {
          text-align: left;
          padding: 10px 12px;
          border-bottom: 2px solid #f3f4f6;
          color: #6b7280;
          font-weight: 600;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          white-space: nowrap;
        }
        .dash-table td {
          padding: 12px;
          border-bottom: 1px solid #f9fafb;
          color: #374151;
          vertical-align: middle;
        }
        .dash-table tr:last-child td { border-bottom: none; }
        .dash-table tbody tr:hover { background: #fafafa; }

        /* ── pagination ── */
        .dash-pagination {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 0 0;
          flex-wrap: wrap;
          gap: 8px;
        }
        .pagination-info {
          font-size: 13px;
          color: #6b7280;
        }
        .pagination-controls { display: flex; align-items: center; gap: 8px; }
        .pagination-btn {
          border: 1px solid #e5e7eb;
          background: #fff;
          border-radius: 6px;
          padding: 5px 14px;
          font-size: 13px;
          cursor: pointer;
          color: #374151;
          transition: all 0.15s;
        }
        .pagination-btn:hover:not(:disabled) {
          border-color: #22c55e;
          color: #22c55e;
        }
        .pagination-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        .pagination-page {
          font-size: 13px;
          color: #374151;
          min-width: 48px;
          text-align: center;
        }

        /* ── low stock ── */
        .low-stock-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 12px;
        }
        .low-stock-card {
          display: flex;
          gap: 12px;
          padding: 12px;
          border: 1px solid #fee2e2;
          border-radius: 10px;
          background: #fff5f5;
          align-items: flex-start;
        }
        .low-stock-img {
          width: 44px;
          height: 44px;
          object-fit: cover;
          border-radius: 8px;
          flex-shrink: 0;
        }
        .low-stock-info { flex: 1; min-width: 0; }
        .low-stock-name {
          font-size: 13px;
          font-weight: 600;
          color: #111827;
          margin: 0 0 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .low-stock-category {
          font-size: 11px;
          color: #9ca3af;
          margin: 0 0 6px;
        }
        .low-stock-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 6px;
        }
        .low-stock-badge {
          font-size: 11px;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 9999px;
        }
        .low-stock-badge.out-of-stock { background: #fee2e2; color: #b91c1c; }
        .low-stock-badge.low          { background: #fef9c3; color: #92400e; }
        .low-stock-price {
          font-size: 12px;
          color: #374151;
          font-weight: 500;
        }
        .low-stock-empty {
          text-align: center;
          padding: 32px;
          color: #16a34a;
        }
        .low-stock-empty span { font-size: 28px; }
        .low-stock-empty p { font-size: 14px; margin-top: 8px; }
      `}</style>
    </div>
  );
};

export default AdminHome;
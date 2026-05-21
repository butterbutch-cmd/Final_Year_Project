// src/admin/components/charts/PaymentMethodChart.jsx
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#22c55e", "#3b82f6", "#f59e0b"];

const formatCurrency = (v) => `Rs. ${v.toLocaleString("en-NP")}`;

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { name, value, payload: p } = payload[0];
  return (
    <div className="dashboard-tooltip">
      <p className="tooltip-label">{name}</p>
      <p>Orders: {p.count}</p>
      <p>Revenue: {formatCurrency(p.revenue)}</p>
    </div>
  );
};

/**
 * PaymentMethodChart — doughnut showing gateway breakdown
 * @param {Array}   data    - [{ name, key, count, revenue }]
 * @param {boolean} loading
 */
const PaymentMethodChart = ({ data = [], loading = false }) => {
  if (loading) return <div className="chart-skeleton" />;
  if (!data.length) {
    return (
      <p className="chart-empty">No payment data available.</p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          dataKey="count"
          nameKey="name"
          cx="50%"
          cy="45%"
          innerRadius={60}
          outerRadius={95}
          paddingAngle={3}
          strokeWidth={0}
        >
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          formatter={(value) => (
            <span style={{ fontSize: 12, color: "#374151" }}>{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PaymentMethodChart;
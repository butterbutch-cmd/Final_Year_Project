// src/admin/components/charts/RevenueChart.jsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const formatCurrency = (value) =>
  `Rs. ${value.toLocaleString("en-NP")}`;

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="dashboard-tooltip">
      <p className="tooltip-label">{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} style={{ color: entry.color }}>
          {entry.name}:{" "}
          {entry.dataKey === "revenue"
            ? formatCurrency(entry.value)
            : entry.value}
        </p>
      ))}
    </div>
  );
};

/**
 * RevenueChart
 * @param {Array}  data   - [{ month, revenue, orders }]
 * @param {boolean} loading
 */
const RevenueChart = ({ data = [], loading = false }) => {
  if (loading) {
    return <div className="chart-skeleton" />;
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 12, fill: "#6b7280" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
          tick={{ fontSize: 12, fill: "#6b7280" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }}
        />
        <Bar
          dataKey="revenue"
          name="Revenue (Rs.)"
          fill="#22c55e"
          radius={[4, 4, 0, 0]}
          maxBarSize={40}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default RevenueChart;
// src/admin/components/charts/TopProductsChart.jsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const COLORS = [
  "#22c55e", "#16a34a", "#4ade80", "#86efac", "#bbf7d0",
];

const truncate = (str, max = 18) =>
  str?.length > max ? str.slice(0, max) + "…" : str;

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  return (
    <div className="dashboard-tooltip">
      <p className="tooltip-label">{p.name}</p>
      <p>Sold: {p.totalSold} units</p>
      <p>Revenue: Rs. {p.totalRevenue.toLocaleString("en-NP")}</p>
    </div>
  );
};

/**
 * TopProductsChart — horizontal bar chart of best sellers
 * @param {Array}   data    - [{ name, totalSold, totalRevenue }]
 * @param {boolean} loading
 */
const TopProductsChart = ({ data = [], loading = false }) => {
  if (loading) return <div className="chart-skeleton" />;
  if (!data.length) {
    return <p className="chart-empty">No sales data available.</p>;
  }

  const chartData = data.map((item) => ({
    ...item,
    shortName: truncate(item.name),
  }));

  return (
    <ResponsiveContainer width="100%" height={Math.max(200, data.length * 52)}>
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
        <XAxis
          type="number"
          tick={{ fontSize: 12, fill: "#6b7280" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `Rs. ${(v / 1000).toFixed(0)}k`}
        />
        <YAxis
          type="category"
          dataKey="shortName"
          width={120}
          tick={{ fontSize: 12, fill: "#374151" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="totalRevenue" radius={[0, 4, 4, 0]} maxBarSize={28}>
          {chartData.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TopProductsChart;
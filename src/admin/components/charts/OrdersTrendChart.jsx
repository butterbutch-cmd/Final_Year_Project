// src/admin/components/charts/OrdersTrendChart.jsx
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="dashboard-tooltip">
      <p className="tooltip-label">{label}</p>
      <p style={{ color: "#22c55e" }}>Orders: {payload[0]?.value}</p>
    </div>
  );
};

/**
 * OrdersTrendChart — area chart of daily order counts
 * @param {Array}   data    - [{ date: "YYYY-MM-DD", orders, revenue }]
 * @param {boolean} loading
 */
const OrdersTrendChart = ({ data = [], loading = false }) => {
  if (loading) return <div className="chart-skeleton" />;

  // Show shorter date labels: "15 Jan" format
  const formatted = data.map((d) => {
    const dt = new Date(d.date);
    const label = dt.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
    });
    return { ...d, label };
  });

  // Only show every ~5th tick to avoid crowding on small screens
  const tickInterval = Math.max(1, Math.floor(formatted.length / 6));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart
        data={formatted}
        margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
      >
        <defs>
          <linearGradient id="ordersGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: "#6b7280" }}
          axisLine={false}
          tickLine={false}
          interval={tickInterval}
        />
        <YAxis
          tick={{ fontSize: 12, fill: "#6b7280" }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="orders"
          stroke="#22c55e"
          strokeWidth={2}
          fill="url(#ordersGrad)"
          dot={false}
          activeDot={{ r: 5, fill: "#16a34a" }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default OrdersTrendChart;
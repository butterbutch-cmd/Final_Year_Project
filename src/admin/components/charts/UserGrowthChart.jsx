// src/admin/components/charts/UserGrowthChart.jsx
import {
  LineChart,
  Line,
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
      <p style={{ color: "#3b82f6" }}>New Users: {payload[0]?.value}</p>
    </div>
  );
};

/**
 * UserGrowthChart — line chart of new registrations per month
 * @param {Array}   data    - [{ month, newUsers }]
 * @param {boolean} loading
 */
const UserGrowthChart = ({ data = [], loading = false }) => {
  if (loading) return <div className="chart-skeleton" />;

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart
        data={data}
        margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 12, fill: "#6b7280" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, fill: "#6b7280" }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="newUsers"
          stroke="#3b82f6"
          strokeWidth={2.5}
          dot={{ fill: "#3b82f6", r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default UserGrowthChart;
// src/admin/components/charts/DeliveryStatusChart.jsx
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const STATUS_COLORS = {
  PENDING: "#f59e0b",
  SHIPPED: "#3b82f6",
  DELIVERED: "#22c55e",
  CANCELLED: "#ef4444",
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  return (
    <div className="dashboard-tooltip">
      <p className="tooltip-label">{name}</p>
      <p>Count: {value}</p>
    </div>
  );
};

const renderCustomLabel = ({
  cx, cy, midAngle, innerRadius, outerRadius, percent,
}) => {
  if (percent < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={12}
      fontWeight={600}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

/**
 * DeliveryStatusChart — pie chart for delivery status breakdown
 * @param {Array}   data    - [{ name: "PENDING" | "SHIPPED" | "DELIVERED" | "CANCELLED", count }]
 * @param {boolean} loading
 */
const DeliveryStatusChart = ({ data = [], loading = false }) => {
  if (loading) return <div className="chart-skeleton" />;
  if (!data.length) {
    return <p className="chart-empty">No delivery data available.</p>;
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
          outerRadius={95}
          labelLine={false}
          label={renderCustomLabel}
          strokeWidth={0}
        >
          {data.map((entry, index) => (
            <Cell
              key={index}
              fill={STATUS_COLORS[entry.name] || "#9ca3af"}
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          formatter={(value) => (
            <span style={{ fontSize: 12, color: "#374151" }}>
              {value.charAt(0) + value.slice(1).toLowerCase()}
            </span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default DeliveryStatusChart;
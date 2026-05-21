// src/admin/components/RecentTransactionsTable.jsx

const STATUS_STYLES = {
  COMPLETED: { bg: "#dcfce7", color: "#15803d" },
  PENDING:   { bg: "#fef9c3", color: "#92400e" },
  FAILED:    { bg: "#fee2e2", color: "#b91c1c" },
  REFUNDED:  { bg: "#e0e7ff", color: "#3730a3" },
  CANCELLED: { bg: "#f3f4f6", color: "#4b5563" },
};

const DELIVERY_STYLES = {
  PENDING:   { bg: "#fef9c3", color: "#92400e" },
  SHIPPED:   { bg: "#dbeafe", color: "#1d4ed8" },
  DELIVERED: { bg: "#dcfce7", color: "#15803d" },
  CANCELLED: { bg: "#fee2e2", color: "#b91c1c" },
};

const Badge = ({ label, styleMap }) => {
  const style = styleMap[label] || { bg: "#f3f4f6", color: "#374151" };
  return (
    <span
      style={{
        backgroundColor: style.bg,
        color: style.color,
        padding: "2px 10px",
        borderRadius: "9999px",
        fontSize: "11px",
        fontWeight: 600,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
};

const formatDate = (iso) => {
  const d = new Date(iso);
  return d.toLocaleDateString("en-NP", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

/**
 * RecentTransactionsTable
 * @param {Array}    transactions - array of transaction objects
 * @param {number}   total        - total count for pagination
 * @param {number}   page         - current page
 * @param {number}   totalPages
 * @param {Function} onPageChange - (newPage) => void
 * @param {boolean}  loading
 */
const RecentTransactionsTable = ({
  transactions = [],
  total = 0,
  page = 1,
  totalPages = 1,
  onPageChange,
  loading = false,
}) => {
  if (loading) {
    return (
      <div style={{ padding: "24px", textAlign: "center", color: "#9ca3af" }}>
        Loading transactions…
      </div>
    );
  }

  if (!transactions.length) {
    return (
      <div style={{ padding: "24px", textAlign: "center", color: "#9ca3af" }}>
        No transactions found.
      </div>
    );
  }

  return (
    <div>
      <div style={{ overflowX: "auto" }}>
        <table className="dash-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Email</th>
              <th>Amount</th>
              <th>Gateway</th>
              <th>Status</th>
              <th>Delivery</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx._id}>
                <td style={{ fontWeight: 500 }}>
                  {tx.customerDetails?.name || "—"}
                </td>
                <td style={{ color: "#6b7280" }}>
                  {tx.customerDetails?.email || "—"}
                </td>
                <td style={{ fontWeight: 600, color: "#15803d" }}>
                  Rs. {tx.amount?.toLocaleString("en-NP")}
                </td>
                <td style={{ textTransform: "capitalize" }}>
                  {tx.payment_gateway === "cod"
                    ? "COD"
                    : tx.payment_gateway?.charAt(0).toUpperCase() +
                      tx.payment_gateway?.slice(1)}
                </td>
                <td>
                  <Badge label={tx.status} styleMap={STATUS_STYLES} />
                </td>
                <td>
                  <Badge label={tx.deliveryStatus} styleMap={DELIVERY_STYLES} />
                </td>
                <td style={{ color: "#6b7280", fontSize: "13px" }}>
                  {formatDate(tx.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="dash-pagination">
        <span className="pagination-info">
          Showing {transactions.length} of {total} transactions
        </span>
        <div className="pagination-controls">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="pagination-btn"
          >
            ‹ Prev
          </button>
          <span className="pagination-page">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="pagination-btn"
          >
            Next ›
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecentTransactionsTable;
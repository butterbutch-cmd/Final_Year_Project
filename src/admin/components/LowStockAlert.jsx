// NOTE: Named LowStockAlert (not LowStockTable) to avoid any future filename collisions.

const LOW_STOCK_THRESHOLD = 5;

const StockBar = ({ stock }) => {
  const pct = Math.min((stock / LOW_STOCK_THRESHOLD) * 100, 100);
  const color = stock === 0 ? "#ef4444" : stock <= 2 ? "#f97316" : "#f59e0b";
  return (
    <div
      style={{
        background: "#f3f4f6",
        borderRadius: 4,
        height: 6,
        width: "100%",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${pct}%`,
          height: "100%",
          background: color,
          borderRadius: 4,
          transition: "width 0.3s ease",
        }}
      />
    </div>
  );
};

/**
 * LowStockAlert — card-grid list of low-stock products
 * @param {Array}   items   - [{ _id, name, category, stock, price, image }]
 * @param {boolean} loading
 */
const LowStockAlert = ({ items = [], loading = false }) => {
  if (loading) {
    return (
      <div style={{ padding: "16px", color: "#9ca3af", textAlign: "center" }}>
        Checking inventory…
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="low-stock-empty">
        <span>✅</span>
        <p>All products are adequately stocked.</p>
      </div>
    );
  }

  return (
    <div className="low-stock-grid">
      {items.map((item) => (
        <div key={item._id} className="low-stock-card">
          {item.image && (
            <img
              src={item.image}
              alt={item.name}
              className="low-stock-img"
              onError={(e) => { e.target.style.display = "none"; }}
            />
          )}
          <div className="low-stock-info">
            <p className="low-stock-name">{item.name}</p>
            <p className="low-stock-category">{item.category}</p>
            <StockBar stock={item.stock} />
            <div className="low-stock-meta">
              <span
                className={`low-stock-badge ${
                  item.stock === 0 ? "out-of-stock" : "low"
                }`}
              >
                {item.stock === 0 ? "Out of Stock" : `${item.stock} left`}
              </span>
              <span className="low-stock-price">
                Rs. {item.price?.toLocaleString("en-NP")}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LowStockAlert;
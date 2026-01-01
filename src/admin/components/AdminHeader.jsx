const AdminHeader = () => {
  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 24px",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
      }}
    >
      <h2
        style={{
          fontSize: "22px",
          fontWeight: 600,
          color: "#1f2937",
        }}
      >
        Admin Dashboard
      </h2>

      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <span style={{ fontSize: "15px", fontWeight: 500, color: "#374151" }}>
          Admin
        </span>

        <button
          style={{
            padding: "8px 14px",
            backgroundColor: "#ef4444",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;

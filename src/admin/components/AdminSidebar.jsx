const AdminSidebar = ({ setActivePage }) => {
  const sidebarStyle = {
    width: "250px",
    backgroundColor: "#f9fafb",          // soft grey
    padding: "20px 0",
    height: "100vh",
    position: "sticky",                  // sticky sidebar
    top: 0,
    borderRight: "1px solid #e5e7eb",
    boxShadow: "1px 0 4px rgba(0, 0, 0, 0.05)",
    alignSelf: "flex-start",
  };

  const ulStyle = {
    listStyle: "none",
    margin: 0,
    padding: 0,
  };

  const liStyle = {
    padding: "14px 24px",
    color: "#374151",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "500",
    borderLeft: "4px solid transparent",
    margin: "6px 0",
    borderRadius: "6px",
    transition: "all 0.25s ease",
  };

  const handleMouseEnter = (e) => {
    e.currentTarget.style.backgroundColor = "#e5e7eb";
    e.currentTarget.style.borderLeftColor = "#2563eb";
    e.currentTarget.style.color = "#2563eb";
    e.currentTarget.style.paddingLeft = "28px";
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.backgroundColor = "transparent";
    e.currentTarget.style.borderLeftColor = "transparent";
    e.currentTarget.style.color = "#374151";
    e.currentTarget.style.paddingLeft = "24px";
  };

  return (
    <aside style={sidebarStyle}>
      <ul style={ulStyle}>
        <li
          style={liStyle}
          onClick={() => setActivePage("home")}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          Home
        </li>

        <li
          style={liStyle}
          onClick={() => setActivePage("inventory")}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          Product Management
        </li>
      </ul>
    </aside>
  );
};

export default AdminSidebar;

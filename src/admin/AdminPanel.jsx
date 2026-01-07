import { useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode"; // 🔥 default import for Vite
import AdminLayout from "./AdminLayout";
import AdminHome from "./pages/AdminHome";
import Inventory from "./pages/Inventory";
import UserManager from "./pages/UserManager";
import AdminRoles from "./pages/AdminRoles";
import ContentManager from "./pages/ContentManager"; // 🔥 new page

const AdminPanel = () => {
  const [activePage, setActivePage] = useState("home");
  const [userRole, setUserRole] = useState(null); // null = loading

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserRole(decoded.role);
      } catch (err) {
        console.error("Invalid token", err);
        setUserRole("guest");
      }
    } else {
      setUserRole("guest");
    }
  }, []);

  const renderPage = () => {
    if (!userRole) return <div>Loading...</div>; // wait for role

    switch (activePage) {
      case "inventory":
        // Only super_admin and admin can see Inventory
        if (!["super_admin", "admin"].includes(userRole)) 
          return <div>Access Denied</div>;
        return <Inventory />;

      case "users":
        // Moderator can see UserManager
        if (!["super_admin", "admin", "moderator"].includes(userRole))
          return <div>Access Denied</div>;
        return <UserManager />;

      case "roles":
        // Only super_admin can see AdminRoles
        if (userRole !== "super_admin") 
          return <div>Access Denied</div>;
        return <AdminRoles />;

      case "content":
        // Only super_admin and moderator can see ContentManager
        if (!["super_admin", "moderator"].includes(userRole))
          return <div>Access Denied</div>;
        return <ContentManager />;

      default:
        return <AdminHome />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminLayout activePage={activePage} setActivePage={setActivePage}>
        {renderPage()}
      </AdminLayout>
    </div>
  );
};

export default AdminPanel;

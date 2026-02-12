import { useState, useEffect } from "react";
import { getMyAdminProfile } from "../services/adminAPI";

import AdminLayout from "./AdminLayout";
import AdminHome from "./pages/AdminHome";
import Inventory from "./pages/Inventory";
import UserManager from "./pages/UserManager";
import AdminRoles from "./pages/AdminRoles";
import ContentManager from "./pages/ContentManager";
import Payment from "./pages/Payment";

const AdminPanel = () => {
  const [activePage, setActivePage] = useState("home");
  const [user, setUser] = useState(null); // stores admin info & permissions
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getMyAdminProfile();
        setUser(profile);
      } catch (err) {
        console.error("Failed to fetch profile", err);
        setUser({ role: "guest", permissions: {} });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const renderPage = () => {
    if (loading) return <div>Loading...</div>;
    if (!user) return <div>Access Denied</div>;

    const { role, permissions } = user;

    switch (activePage) {
      case "inventory":
        if (!permissions.products?.view) return <div>Access Denied</div>;
        return <Inventory />;

      case "users":
        if (!permissions.users?.view) return <div>Access Denied</div>;
        return <UserManager />;

      case "roles":
        if (role !== "super_admin") return <div>Access Denied</div>;
        return <AdminRoles />;

      case "content":
        if (!permissions.content?.view) return <div>Access Denied</div>;
        return <ContentManager />;
      
      case "payment":
        if (!permissions.payments?.view) return <div>Access Denied</div>
        return <Payment/>
      default:
        return <AdminHome />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminLayout
        activePage={activePage}
        setActivePage={setActivePage}
        user={user}
      >
        {renderPage()}
      </AdminLayout>
    </div>
  );
};

export default AdminPanel;

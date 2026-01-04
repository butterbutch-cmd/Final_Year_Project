import { useState } from "react";
import AdminLayout from "./AdminLayout";
import AdminHome from "./pages/AdminHome";
import Inventory from "./pages/Inventory";
import UserManager from "./pages/UserManager";

const AdminPanel = () => {
  const [activePage, setActivePage] = useState("home");

  const renderPage = () => {
    switch (activePage) {
      case "inventory":
        return <Inventory />;
      case "users":
        return <UserManager />;
      default:
        return <AdminHome />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminLayout
        activePage={activePage}
        setActivePage={setActivePage}
      >
        {renderPage()}
      </AdminLayout>
    </div>
  );
};

export default AdminPanel;




// AdminPanel (state lives here)
//    ↓ activePage, setActivePage
// AdminLayout (passes through)
//    ↓ activePage, setActivePage
// AdminSidebar (uses activePage to highlight)

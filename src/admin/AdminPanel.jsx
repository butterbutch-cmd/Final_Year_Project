import { useState } from "react";
import AdminLayout from "./AdminLayout";
import AdminHome from "./pages/AdminHome";
import Inventory from "./pages/Inventory";

const AdminPanel = () => {
  const [activePage, setActivePage] = useState("home");

  const renderPage = () => {
    if (activePage === "inventory") return <Inventory />;
    return <AdminHome />;
  };

  return (
    <AdminLayout setActivePage={setActivePage}>
      {renderPage()}
    </AdminLayout>
  );
};

export default AdminPanel;

import AdminHeader from "./components/AdminHeader";
import AdminSidebar from "./components/AdminSidebar";

const AdminLayout = ({ children, setActivePage, activePage, userRole }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top header */}
      <AdminHeader />

      {/* Sidebar + Main content */}
      <div className="flex flex-1">
        <AdminSidebar
          activePage={activePage}
          setActivePage={setActivePage}
          userRole={userRole} // 🔥 pass user role to sidebar
        />

        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

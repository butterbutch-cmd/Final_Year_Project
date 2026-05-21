import AdminHeader from "./components/AdminHeader";
import AdminSidebar from "./components/AdminSidebar";

const AdminLayout = ({ children, setActivePage, activePage, user }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <AdminHeader />
      <div className="flex flex-1">
        <AdminSidebar
          activePage={activePage}
          setActivePage={setActivePage}
          user={user}
        />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
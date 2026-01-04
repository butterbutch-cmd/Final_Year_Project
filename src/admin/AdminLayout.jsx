import AdminHeader from "./components/AdminHeader";
import AdminSidebar from "./components/AdminSidebar";

const AdminLayout = ({ children, setActivePage, activePage }) => {
  return (
    <div>
      <AdminHeader />
      <div style={{ display: "flex" }}>
        <AdminSidebar 
          activePage={activePage}
          setActivePage={setActivePage} 
        />
        <main style={{ flex: 1, minWidth: 0 }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
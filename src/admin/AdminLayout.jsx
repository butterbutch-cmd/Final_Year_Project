import AdminHeader from "./components/AdminHeader";
import AdminSidebar from "./components/AdminSidebar";

const AdminLayout = ({ children, setActivePage }) => {
  return (
    <div>
      <AdminHeader />
      <div style={{ display: "flex" }}>
        <AdminSidebar setActivePage={setActivePage} />
        <main>{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;

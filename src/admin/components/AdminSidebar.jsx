import { Home, Boxes, Users, LogOut, Shield, FileText, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminSidebar = ({ activePage, setActivePage, user }) => {
  const navigate = useNavigate();
  const role = user?.role;
  const perms = user?.permissions || {};

  const menuItems = [
    { key: "home", label: "Home", icon: Home },
    {
      key: "inventory",
      label: "Product Management",
      icon: Boxes,
      hide: !perms.products?.view,
    },
    {
      key: "users",
      label: "User Management",
      icon: Users,
      hide: !perms.users?.view,
    },
    {
      key: "roles",
      label: "Admin Roles",
      icon: Shield,
      hide: role !== "super_admin",
    },
    {
      key: "content",
      label: "Content Manager",
      icon: FileText,
      hide: !perms.content?.view,
    },
    {
      key: "payment",
      label: "Payment",
      icon: CreditCard,
      hide: !perms.payments?.view, // optional: hide if permission not given
    },
    {
      key: "logout",
      label: "Logout",
      icon: LogOut,
      onClick: () => {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
      },
    },
  ];

  const baseClasses = `
    flex items-center gap-3 px-6 py-[14px] my-1.5 text-[15px] font-medium cursor-pointer
    rounded-md border-l-4 transition-all duration-200 ease-in-out
  `;
  const activeClasses = `bg-gray-200 border-green-600 text-green-600 pl-7`;
  const inactiveClasses = `text-gray-700 border-transparent hover:bg-gray-200 hover:border-green-600 hover:text-green-600 hover:pl-7`;

  return (
    <aside className="w-[240px] bg-gray-50 py-5 h-screen sticky top-0 border-r border-gray-200 shadow-[1px_0_4px_rgba(0,0,0,0.05)] shrink-0">
      <ul className="list-none m-0 p-0">
        {menuItems.map(({ key, label, icon: Icon, onClick, hide }) => {
          if (hide) return null;
          const isActive = activePage === key;
          return (
            <li
              key={key}
              onClick={onClick ? onClick : () => setActivePage(key)}
              className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default AdminSidebar;

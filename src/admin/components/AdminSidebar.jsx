// import {Home, Boxes, Users, LogOut, Shield, FileText, CreditCard,Flag} from "lucide-react";
// import { useNavigate } from "react-router-dom";

// const AdminSidebar = ({ activePage, setActivePage, user }) => {
//   const navigate = useNavigate();
//   const role = user?.role;
//   const perms = user?.permissions || {};

// const menuItems = [
//   {
//     key: "home", label: "Home", icon: Home, hide: role !== "super_admin",
// },

//   {
//     key: "inventory", label: "Product Management", icon: Boxes, hide: !perms.products?.view,
//   },

//   {
//     key: "users",
//     label: "User Management",
//     icon: Users,
//     hide: !perms.users?.view,
//   },

//   {
//     key: "roles",
//     label: "Admin Roles",
//     icon: Shield,
//     hide: role !== "super_admin",
//   },

//   {
//     key: "content",
//     label: "Content Manager",
//     icon: FileText,
//     hide: !perms.content?.view,
//   },

//   {
//     key: "payment",
//     label: "Payment",
//     icon: CreditCard,
//     hide: !perms.payments?.view,
//   },

//   {
//     key: "community",
//     label: "Community Moderation",
//     icon: Flag,
//     hide: role !== "super_admin" && !perms.community?.view,
//   },

//   {
//     key: "logout",
//     label: "Logout",
//     icon: LogOut,
//     onClick: () => {
//       localStorage.removeItem("adminToken");
//       navigate("/admin/login");
//     },
//   },
// ];

//   const baseClasses = `
//     flex items-center gap-3 px-6 py-[14px] my-1.5 text-[15px] font-medium cursor-pointer
//     rounded-md border-l-4 transition-all duration-200 ease-in-out
//   `;

//   const activeClasses = `bg-gray-200 border-green-600 text-green-600 pl-7`;

//   const inactiveClasses = `
//     text-gray-700 border-transparent 
//     hover:bg-gray-200 hover:border-green-600 hover:text-green-600 hover:pl-7
//   `;

//   return (
//     <aside className="w-[240px] bg-gray-50 py-5 h-screen sticky top-0 border-r border-gray-200 shadow-[1px_0_4px_rgba(0,0,0,0.05)] shrink-0">
//       <ul className="list-none m-0 p-0">
//         {menuItems.map(({ key, label, icon: Icon, onClick, hide }) => {
//           if (hide) return null;

//           const isActive = activePage === key;

//           return (
//             <li
//               key={key}
//               onClick={onClick ? onClick : () => setActivePage(key)}
//               className={`${baseClasses} ${
//                 isActive ? activeClasses : inactiveClasses
//               }`}
//             >
//               <Icon size={18} />
//               <span>{label}</span>
//             </li>
//           );
//         })}
//       </ul>
//     </aside>
//   );
// };

// export default AdminSidebar;

import {
  Home,
  Boxes,
  Users,
  LogOut,
  Shield,
  FileText,
  CreditCard,
  Flag,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const serif = { fontFamily: "'Cormorant Garamond', serif" };
const sans = { fontFamily: "'DM Sans', sans-serif" };

const AdminSidebar = ({ activePage, setActivePage, user }) => {
  const navigate = useNavigate();
  const role = user?.role;
  const perms = user?.permissions || {};

  const menuItems = [
    {
      key: "home",
      label: "Home",
      icon: Home,
      hide: role !== "super_admin",
    },
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
      hide: !perms.payments?.view,
    },
    {
      key: "community",
      label: "Community Moderation",
      icon: Flag,
      hide: role !== "super_admin" && !perms.community?.view,
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

  return (
    <aside className="w-[270px] h-screen sticky top-0 shrink-0 bg-[#fdfcf8] border-r border-[#2d4a2d]/10 shadow-[1px_0_18px_rgba(26,51,32,0.04)] overflow-hidden">
      {/* Menu */}
      <div className="px-4 py-5">
        {/* <p
          className="px-2 mb-3 text-[11px] uppercase tracking-[0.2em] text-[#8c8880]"
          style={sans}
        >
          Navigation
        </p> */}

        <ul className="list-none m-0 p-0">
          {menuItems.map(({ key, label, icon: Icon, onClick, hide }) => {
            if (hide) return null;

            const isActive = activePage === key;

            return (
              <li
                key={key}
                onClick={onClick ? onClick : () => setActivePage(key)}
                className={`
                  group flex items-center justify-between gap-3 px-4 py-3.5 my-1.5
                  rounded-xl cursor-pointer border transition-all duration-200 ease-in-out
                  ${isActive
                    ? "bg-[#eef5ee] border-[#2d4a2d]/15 text-[#1a3320] shadow-[0_4px_16px_rgba(26,51,32,0.06)]"
                    : "bg-transparent border-transparent text-[#2c2c2c] hover:bg-[#f7f4ee] hover:border-[#2d4a2d]/10 hover:text-[#2d4a2d]"
                  }
                `}
                style={sans}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`
                      w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0
                      transition-all duration-200
                      ${isActive ? "bg-[#1a3320] text-[#f7f4ee]" : "bg-[#2d4a2d]/8 text-[#2d4a2d] group-hover:bg-[#2d4a2d]/12"}
                    `}
                  >
                    <Icon size={17} />
                  </span>

                  <span className="text-[14px] font-medium truncate">
                    {label}
                  </span>
                </div>

                <ChevronRight
                  size={15}
                  className={`
                    flex-shrink-0 transition-all duration-200
                    ${isActive ? "text-[#2d4a2d] translate-x-0" : "text-[#8c8880] group-hover:text-[#2d4a2d] group-hover:translate-x-0.5"}
                  `}
                />
              </li>
            );
          })}
        </ul>
      </div>

      {/* Footer */}
      <div className="mt-auto px-4 pb-5">
        <div className="rounded-2xl border border-[#2d4a2d]/10 bg-[#f7f4ee] p-4">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[#8c8880] mb-2" style={sans}>
            Logged in as
          </p>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1a3320] text-[#f7f4ee] flex items-center justify-center text-[14px] font-semibold">
              {(user?.username || "A")[0].toUpperCase()}
            </div>

            <div className="min-w-0">
              <p className="text-[14px] text-[#1a3320] font-medium m-0 truncate" style={sans}>
                {user?.username || "Admin User"}
              </p>
              <p className="text-[11px] text-[#8c8880] m-0 truncate" style={sans}>
                {role || "admin"}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              localStorage.removeItem("adminToken");
              navigate("/admin/login");
            }}
            className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#1a3320] text-[#f7f4ee] text-[11px] uppercase tracking-[0.14em] hover:bg-[#2d4a2d] transition-all"
            style={sans}
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
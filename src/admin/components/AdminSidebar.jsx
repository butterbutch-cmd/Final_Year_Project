import { Home, Boxes, Users } from "lucide-react";

const AdminSidebar = ({ activePage, setActivePage }) => {
  const menuItems = [
    {
      key: "home",
      label: "Home",
      icon: Home,
    },
    {
      key: "inventory",
      label: "Product Management",
      icon: Boxes,
    },
    {
      key: "users",
      label: "User Management",
      icon: Users,
    },
  ];

  const baseClasses = `
    flex items-center gap-3
    px-6 py-[14px]
    mx-0 my-1.5
    text-[15px]
    font-medium
    cursor-pointer
    rounded-md
    border-l-4
    transition-all duration-200 ease-in-out
  `;

  const activeClasses = `
    bg-gray-200
    border-green-600
    text-green-600
    pl-7
  `;

  const inactiveClasses = `
    text-gray-700
    border-transparent
    hover:bg-gray-200
    hover:border-green-600
    hover:text-green-600
    hover:pl-7
  `;

  return (
    <aside
      className="
        w-[240px]
        bg-gray-50
        py-5
        h-screen
        sticky
        top-0
        border-r
        border-gray-200
        shadow-[1px_0_4px_rgba(0,0,0,0.05)]
        shrink-0
      "
    >
      <ul className="list-none m-0 p-0">
        {menuItems.map(({ key, label, icon: Icon }) => {
          const isActive = activePage === key;

          return (
            <li
              key={key}
              onClick={() => setActivePage(key)}
              className={`
                ${baseClasses}
                ${isActive ? activeClasses : inactiveClasses}
              `}
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

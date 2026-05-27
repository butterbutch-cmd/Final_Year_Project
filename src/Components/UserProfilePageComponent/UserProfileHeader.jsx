import { Link, useLocation } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useState } from "react";

const serif = { fontFamily: "'Cormorant Garamond', serif" };
const sans = { fontFamily: "'DM Sans', sans-serif" };

const NAV_ITEMS = [
  { name: "Profile", path: "/profile" },
  { name: "Orders", path: "/orders" },
  { name: "Wishlist", path: "/wishlist" },
];

export default function UserProfileHeader() {
  const [hoverLogout, setHoverLogout] = useState(false);
  const location = useLocation();

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      console.log("User logged out");
    }
  };

  return (
    <div
      className="flex items-center justify-between px-6 lg:px-14 py-4 bg-[#fdfcf8] border-b border-[#2d4a2d]/10"
      style={sans}
    >
      {/* LEFT: Logo + Nav */}
      <div className="flex items-center gap-10">
        <Link to="/">
          <h2
            className="text-[22px] tracking-[0.18em] uppercase text-[#1a3320] m-0 hover:text-[#2d4a2d] transition-colors duration-200"
            style={serif}
          >
            FloraVerse
          </h2>
        </Link>

        <nav>
          <ul className="list-none flex items-center gap-7 m-0 p-0">
            {NAV_ITEMS.map((item) => {
              const active = location.pathname === item.path;
              return (
                <li key={item.name} className="relative group">
                  <Link
                    to={item.path}
                    className={`text-[12px] tracking-[0.1em] uppercase transition-colors duration-200 ${
                      active
                        ? "text-[#1a3320]"
                        : "text-[#8c8880] hover:text-[#1a3320]"
                    }`}
                    style={sans}
                  >
                    {item.name}
                  </Link>
                  {/* Active / hover underline */}
                  <span
                    className={`absolute left-0 -bottom-1 h-px bg-[#2d4a2d] transition-all duration-300 ${
                      active ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* RIGHT: Logout */}
      <button
        onClick={handleLogout}
        onMouseEnter={() => setHoverLogout(true)}
        onMouseLeave={() => setHoverLogout(false)}
        className={`flex items-center gap-2 px-4 py-2 text-[11.5px] tracking-[0.1em] uppercase rounded-sm border transition-all duration-200 cursor-pointer ${
          hoverLogout
            ? "bg-[#c4704a]/10 border-[#c4704a]/40 text-[#c4704a]"
            : "bg-transparent border-[#2d4a2d]/20 text-[#8c8880] hover:text-[#c4704a]"
        }`}
        style={sans}
        title="Logout"
      >
        <LogOut size={13} />
        <span>Log out</span>
      </button>
    </div>
  );
}
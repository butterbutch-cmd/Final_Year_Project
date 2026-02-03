import { Link } from "react-router-dom";
import { LogOut } from "lucide-react"; 
import { useState } from "react";

export default function UserProfileHeader() {
  const [hoverLogout, setHoverLogout] = useState(false);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      // Add your logout logic here (e.g., clearing auth tokens)
      console.log("User logged out");
    }
  };

  return (
    <div className="flex items-center justify-between px-[190px] pt-[15px] pb-[10px] border border-gray-100 shadow">

      {/* LEFT SECTION */}
      <div className="flex gap-10 items-center">
        <h2 className="text-[28px] font-bold tracking-[2px] text-[#2d3436] m-0 cursor-pointer transition-colors duration-300 ease-in-out hover:text-green-600">
          <Link to="/">MENDHO</Link>
        </h2>

        {/* MENU LIST */}
        <ul className="list-none flex gap-5">
          {[
            { name: "Profile", path: "/profile" },
            { name: "Orders", path: "/orders" },  // You will create this page
            { name: "Wishlist", path: "/wishlist" }  // You will create this page
          ].map((item) => (
            <li
              key={item.name}
              className="relative cursor-pointer text-gray-800 transition-colors duration-300 hover:text-green-600 group"
            >
              <Link to={item.path}>{item.name}</Link>
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-green-600 transition-all duration-300 group-hover:w-full"></span>
            </li>
          ))}
        </ul>
      </div>

      {/* RIGHT SECTION: Circular logout icon */}
      <div>
        <div 
          onClick={handleLogout}
          onMouseEnter={() => setHoverLogout(true)}
          onMouseLeave={() => setHoverLogout(false)}
          className={`
            w-12 h-12 rounded-full flex items-center justify-center
            border-2 border-gray-300 transition-all duration-300 ease-in-out
            cursor-pointer shadow-md
            ${hoverLogout ? "bg-red-600 text-white border-red-600" : "bg-white text-gray-800"}
          `}
          title="Logout"
        >
          <LogOut size={24} />
        </div>
      </div>

    </div>
  );
}

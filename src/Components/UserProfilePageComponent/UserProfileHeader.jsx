// import { Link } from "react-router-dom";
// import { LogOut } from "lucide-react"; 
// import { useState } from "react";

// export default function UserProfileHeader() {
//   const [hoverLogout, setHoverLogout] = useState(false);

//   const handleLogout = () => {
//     const confirmLogout = window.confirm("Are you sure you want to log out?");
//     if (confirmLogout) {
//       // Add your logout logic here (e.g., clearing auth tokens)
//       console.log("User logged out");
//     }
//   };

//   return (
//     <div className="flex items-center justify-between px-[190px] pt-[15px] pb-[10px] border border-gray-100 shadow">

//       {/* LEFT SECTION */}
//       <div className="flex gap-10 items-center">
//         <h2 className="text-[28px] font-bold tracking-[2px] text-[#2d3436] m-0 cursor-pointer transition-colors duration-300 ease-in-out hover:text-green-600">
//           <Link to="/">MENDHO</Link>
//         </h2>

//         {/* MENU LIST */}
//         <ul className="list-none flex gap-5">
//           {[
//             { name: "Profile", path: "/profile" },
//             { name: "Orders", path: "/orders" },  // You will create this page
//             { name: "Wishlist", path: "/wishlist" }  // You will create this page
//           ].map((item) => (
//             <li
//               key={item.name}
//               className="relative cursor-pointer text-gray-800 transition-colors duration-300 hover:text-green-600 group"
//             >
//               <Link to={item.path}>{item.name}</Link>
//               <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-green-600 transition-all duration-300 group-hover:w-full"></span>
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* RIGHT SECTION: Circular logout icon */}
//       <div>
//         <div 
//           onClick={handleLogout}
//           onMouseEnter={() => setHoverLogout(true)}
//           onMouseLeave={() => setHoverLogout(false)}
//           className={`
//             w-12 h-12 rounded-full flex items-center justify-center
//             border-2 border-gray-300 transition-all duration-300 ease-in-out
//             cursor-pointer shadow-md
//             ${hoverLogout ? "bg-red-600 text-white border-red-600" : "bg-white text-gray-800"}
//           `}
//           title="Logout"
//         >
//           <LogOut size={24} />
//         </div>
//       </div>

//     </div>
//   );
// }


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
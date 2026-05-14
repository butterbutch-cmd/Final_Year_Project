// // import { useState, useEffect } from "react";
// // import { Search, Inbox } from "lucide-react";

// // export default function AdminHeader() {
// //   const [searchQuery, setSearchQuery] = useState("");

// //   const [adminInfo, setAdminInfo] = useState({
// //     name: "Admin User",
// //     role: "Loading...",
// //     avatar: "https://i.pinimg.com/736x/a9/f4/f0/a9f4f0c03220e7dd5d0c60a9add61c42.jpg",
// //   });

// //   // Decode JWT function
// //   const decodeToken = (token) => {
// //     try {
// //       if (!token) return null;

// //       const parts = token.split(".");
// //       if (parts.length !== 3) return null;

// //       const payload = parts[1];
// //       return JSON.parse(atob(payload));
// //     } catch (err) {
// //       console.error("Invalid token", err);
// //       return null;
// //     }
// //   };


// //   // Format role nicely for UI
// //   const formatRole = (role) => {
// //     if (!role) return "Admin";

// //     if (role === "super_admin") return "Super Admin";
// //     if (role === "admin") return "Admin";

// //     // Fallback: Capitalize words
// //     return role

// //   };

// // useEffect(() => {
// //   const token = localStorage.getItem("adminToken");

// //   if (token) {
// //     const decoded = decodeToken(token);

// //     if (decoded) {
// //       console.log("🛡️ Decoded JWT Payload:", decoded);

// //       Object.entries(decoded).forEach(([key, value]) => {
// //         console.log(`🔹 ${key}:`, value);
// //       });

// //       setAdminInfo((prev) => ({
// //         ...prev,
// //         name: decoded.username || "Admin User",
// //         role: formatRole(decoded.role),
// //       }));
// //     }
// //   } else {
// //     console.warn("⚠️ No adminToken found in localStorage");

// //     setAdminInfo((prev) => ({
// //       ...prev,
// //       role: "Not Logged In",
// //     }));
// //   }
// // }, []);




// //   const handleSearch = () => {
// //     console.log("Searching for:", searchQuery);
// //   };

// //   return (
// //     <div className="px-3 py-4 bg-gray-50 border-b border-gray-300 backdrop-blur-2xl">
// //       <div className="flex justify-between items-center gap-4">
// //         {/* Logo */}
// //         <div>
// //           <div className="font-extrabold text-lg">FLORA VERSE</div>
// //           <p className="font-light text-sm">Admin Dashboard</p>
// //         </div>

// //         {/* Search Bar */}
// //         <div className="flex-1 flex justify-center px-10">
// //           <div className="flex items-center w-full max-w-120 bg-white border border-black rounded-full overflow-hidden
// //                           transition-all duration-300 ease-in-out focus-within:border-[#329e5b]
// //                           focus-within:ring-3 focus-within:ring-[#329e5b]/10">
            
// //             <input
// //               type="text"
// //               value={searchQuery}
// //               onChange={(e) => setSearchQuery(e.target.value)}
// //               placeholder="Search products..."
// //               className="flex-1 px-5 py-3 text-sm placeholder-black outline-none bg-white"
// //             />

// //             <button
// //               onClick={handleSearch}
// //               className="flex items-center justify-center px-3 py-3 bg-white rounded-full text-gray-600 hover:text-[#329e5b] transition-all duration-300 cursor-pointer"
// //             >
// //               <Search size={20} />
// //             </button>
// //           </div>
// //         </div>

// //         {/* Admin Info */}
// //         <div className="flex items-center gap-4">
// //           <Inbox size={25} className="text-gray-700" />

// //           <div>
// //             <p className="font-bold">{adminInfo.name}</p>
// //             <p className="font-light">{adminInfo.role}</p>
// //           </div>

// //           <img
// //             src={adminInfo.avatar}
// //             alt="Admin Avatar"
// //             className="w-12 h-12 rounded-full object-cover"
// //           />
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }


// import { useState, useEffect, useRef } from "react";
// import { Search, Inbox } from "lucide-react";

// import {
//   getAdminNotifications,
//   markAdminRead,
// } from "../../services/notificationAPI";

// export default function AdminHeader() {
//   const [searchQuery, setSearchQuery] = useState("");

//   const [adminInfo, setAdminInfo] = useState({
//     name: "Admin User",
//     role: "Loading...",
//     avatar:
//       "https://i.pinimg.com/736x/a9/f4/f0/a9f4f0c03220e7dd5d0c60a9add61c42.jpg",
//   });

//   /* ===============================
//      NOTIFICATION STATE
//   =============================== */

//   const [notifications, setNotifications] = useState([]);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [openPanel, setOpenPanel] = useState(false);

//   const notifRef = useRef();

//   /* ===============================
//      LOAD ADMIN NOTIFICATIONS
//   =============================== */

//   const loadNotifications = async () => {
//     try {
//       const data = await getAdminNotifications();

//       setNotifications(data);

//       const unread = data.filter((n) => !n.read).length;
//       setUnreadCount(unread);
//     } catch (err) {
//       console.error("Notification load error", err);
//     }
//   };

//   useEffect(() => {
//     loadNotifications();

//     const interval = setInterval(loadNotifications, 10000);
//     return () => clearInterval(interval);
//   }, []);

//   /* ===============================
//      CLICK OUTSIDE CLOSE
//   =============================== */

//   useEffect(() => {
//     const handler = (e) => {
//       if (!notifRef.current?.contains(e.target)) {
//         setOpenPanel(false);
//       }
//     };

//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   /* ===============================
//      MARK AS READ
//   =============================== */

//   const markAsRead = async (id) => {
//     try {
//       await markAdminRead(id);

//       setNotifications((prev) =>
//         prev.map((n) => (n._id === id ? { ...n, read: true } : n))
//       );

//       setUnreadCount((prev) => Math.max(prev - 1, 0));
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   /* ===============================
//      JWT DECODE
//   =============================== */

//   const decodeToken = (token) => {
//     try {
//       if (!token) return null;

//       const parts = token.split(".");
//       if (parts.length !== 3) return null;

//       return JSON.parse(atob(parts[1]));
//     } catch (err) {
//       console.error("Invalid token", err);
//       return null;
//     }
//   };

//   const formatRole = (role) => {
//     if (!role) return "Admin";

//     if (role === "super_admin") return "Super Admin";
//     if (role === "admin") return "Admin";

//     return role;
//   };

//   useEffect(() => {
//     const token = localStorage.getItem("adminToken");

//     if (token) {
//       const decoded = decodeToken(token);

//       if (decoded) {
//         setAdminInfo((prev) => ({
//           ...prev,
//           name: decoded.username || "Admin User",
//           role: formatRole(decoded.role),
//         }));
//       }
//     } else {
//       setAdminInfo((prev) => ({
//         ...prev,
//         role: "Not Logged In",
//       }));
//     }
//   }, []);

//   const handleSearch = () => {
//     console.log("Searching for:", searchQuery);
//   };

//   return (
//     <div className="px-3 py-4 bg-gray-50 border-b border-gray-300 backdrop-blur-2xl">
//       <div className="flex justify-between items-center gap-4">
//         {/* Logo */}
//         <div>
//           <div className="font-extrabold text-lg">FLORA VERSE</div>
//           <p className="font-light text-sm">Admin Dashboard</p>
//         </div>

//         {/* Search Bar */}
//         <div className="flex-1 flex justify-center px-10">
//           <div className="flex items-center w-full max-w-120 bg-white border border-black rounded-full overflow-hidden">
//             <input
//               type="text"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               placeholder="Search products..."
//               className="flex-1 px-5 py-3 text-sm outline-none bg-white"
//             />

//             <button
//               onClick={handleSearch}
//               className="px-3 py-3 text-gray-600 hover:text-[#329e5b]"
//             >
//               <Search size={20} />
//             </button>
//           </div>
//         </div>

//         {/* Admin Info + Notifications */}
//         <div className="flex items-center gap-4" ref={notifRef}>
//           {/* NOTIFICATION ICON */}
//           <div className="relative">
//             <button onClick={() => setOpenPanel(!openPanel)}>
//               <Inbox size={25} className="text-gray-700" />
//             </button>

//             {/* BADGE */}
//             {unreadCount > 0 && (
//               <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
//                 {unreadCount}
//               </span>
//             )}

//             {/* PANEL */}
//             {openPanel && (
//               <div className="absolute right-0 mt-3 w-80 bg-white shadow-xl rounded-xl border z-50 max-h-96 overflow-y-auto">
//                 <div className="p-3 border-b font-semibold">
//                   Admin Notifications
//                 </div>

//                 {notifications.length === 0 ? (
//                   <div className="p-4 text-gray-500 text-sm">
//                     No notifications
//                   </div>
//                 ) : (
//                   notifications.map((n) => (
//                     <div
//                       key={n._id}
//                       onClick={() => markAsRead(n._id)}
//                       className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${
//                         !n.read ? "bg-green-50" : ""
//                       }`}
//                     >
//                       <p className="font-medium text-sm">{n.title}</p>
//                       <p className="text-xs text-gray-600">{n.message}</p>

//                       <div className="text-[10px] text-gray-400 mt-1">
//                         {new Date(n.createdAt).toLocaleString()}
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </div>
//             )}
//           </div>

//           {/* ADMIN INFO */}
//           <div>
//             <p className="font-bold">{adminInfo.name}</p>
//             <p className="font-light">{adminInfo.role}</p>
//           </div>

//           <img
//             src={adminInfo.avatar}
//             alt="Admin Avatar"
//             className="w-12 h-12 rounded-full object-cover"
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect, useRef } from "react";
import { Search, Inbox } from "lucide-react";

import {
  getAdminNotifications,
  markAdminRead,
} from "../../services/notificationAPI";

export default function AdminHeader() {
  const [searchQuery, setSearchQuery] = useState("");

  const [adminInfo, setAdminInfo] = useState({
    name: "Admin User",
    role: "Loading...",
    avatar:
      "https://i.pinimg.com/736x/a9/f4/f0/a9f4f0c03220e7dd5d0c60a9add61c42.jpg",
  });

  /* ===============================
     NOTIFICATION STATE
  =============================== */

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [openPanel, setOpenPanel] = useState(false);

  const notifRef = useRef();

  /* ===============================
     LOAD ADMIN NOTIFICATIONS
  =============================== */

  const loadNotifications = async () => {
    try {
      const data = await getAdminNotifications();

      setNotifications(data);

      // ✅ FIXED: use isRead
      const unread = data.filter((n) => !n.isRead).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error("Notification load error", err);
    }
  };

  useEffect(() => {
    loadNotifications();

    const interval = setInterval(loadNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  /* ===============================
     CLICK OUTSIDE CLOSE
  =============================== */

  useEffect(() => {
    const handler = (e) => {
      if (!notifRef.current?.contains(e.target)) {
        setOpenPanel(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ===============================
     MARK AS READ
  =============================== */

  const markAsRead = async (id) => {
    try {
      await markAdminRead(id);

      // ✅ FIXED: update isRead
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );

      // recalc unread safely
      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch (err) {
      console.error(err);
    }
  };

  /* ===============================
     JWT DECODE
  =============================== */

  const decodeToken = (token) => {
    try {
      if (!token) return null;

      const parts = token.split(".");
      if (parts.length !== 3) return null;

      return JSON.parse(atob(parts[1]));
    } catch (err) {
      console.error("Invalid token", err);
      return null;
    }
  };

  const formatRole = (role) => {
    if (!role) return "Admin";

    if (role === "super_admin") return "Super Admin";
    if (role === "admin") return "Admin";

    return role;
  };

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (token) {
      const decoded = decodeToken(token);

      if (decoded) {
        setAdminInfo((prev) => ({
          ...prev,
          name: decoded.username || "Admin User",
          role: formatRole(decoded.role),
        }));
      }
    } else {
      setAdminInfo((prev) => ({
        ...prev,
        role: "Not Logged In",
      }));
    }
  }, []);

  const handleSearch = () => {
    console.log("Searching for:", searchQuery);
  };

  return (
    <div className="px-3 py-4 bg-gray-50 border-b border-gray-300 backdrop-blur-2xl">
      <div className="flex justify-between items-center gap-4">
        {/* Logo */}
        <div>
          <div className="font-extrabold text-lg">FLORA VERSE</div>
          <p className="font-light text-sm">Admin Dashboard</p>
        </div>

        {/* Search Bar */}
        <div className="flex-1 flex justify-center px-10">
          <div className="flex items-center w-full max-w-120 bg-white border border-black rounded-full overflow-hidden">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="flex-1 px-5 py-3 text-sm outline-none bg-white"
            />

            <button
              onClick={handleSearch}
              className="px-3 py-3 text-gray-600 hover:text-[#329e5b]"
            >
              <Search size={20} />
            </button>
          </div>
        </div>

        {/* Admin Info + Notifications */}
        <div className="flex items-center gap-4" ref={notifRef}>
          {/* NOTIFICATION ICON */}
          <div className="relative">
            <button onClick={() => setOpenPanel(!openPanel)}>
              <Inbox size={25} className="text-gray-700" />
            </button>

            {/* BADGE */}
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}

            {/* PANEL */}
            {openPanel && (
              <div className="absolute right-0 mt-3 w-80 bg-white shadow-xl rounded-xl border z-50 max-h-96 overflow-y-auto">
                <div className="p-3 border-b font-semibold">
                  Admin Notifications
                </div>

                {notifications.length === 0 ? (
                  <div className="p-4 text-gray-500 text-sm">
                    No notifications
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n._id}
                      onClick={() => markAsRead(n._id)}
                      className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${
                        !n.isRead ? "bg-green-50" : ""
                      }`}
                    >
                      <p className="font-medium text-sm">{n.title}</p>
                      <p className="text-xs text-gray-600">{n.message}</p>

                      <div className="text-[10px] text-gray-400 mt-1">
                        {new Date(n.createdAt).toLocaleString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* ADMIN INFO */}
          <div>
            <p className="font-bold">{adminInfo.name}</p>
            <p className="font-light">{adminInfo.role}</p>
          </div>

          <img
            src={adminInfo.avatar}
            alt="Admin Avatar"
            className="w-12 h-12 rounded-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
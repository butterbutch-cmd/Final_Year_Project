// // import { useState, useEffect } from "react";
// // import { getMyAdminProfile } from "../services/adminAPI";

// // import AdminLayout from "./AdminLayout";
// // import AdminHome from "./pages/AdminHome";
// // import Inventory from "./pages/Inventory";
// // import UserManager from "./pages/UserManager";
// // import AdminRoles from "./pages/AdminRoles";
// // import ContentManager from "./pages/ContentManager";
// // import Payment from "./pages/Payment";
// // import CommunityManagement from "./pages/CommunityManagement";

// // const AdminPanel = () => {
// //   const [activePage, setActivePage] = useState("home");
// //   const [user, setUser] = useState(null); // stores admin info & permissions
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     const fetchProfile = async () => {
// //       try {
// //         const profile = await getMyAdminProfile();
// //         setUser(profile);
// //       } catch (err) {
// //         console.error("Failed to fetch profile", err);
// //         setUser({ role: "guest", permissions: {} });
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchProfile();
// //   }, []);

// //   const renderPage = () => {
// //     if (loading) return <div>Loading...</div>;
// //     if (!user) return <div>Access Denied</div>;

// //     const { role, permissions } = user;

// //     switch (activePage) {
// //       case "inventory":
// //         if (!permissions.products?.view) return <div>Access Denied</div>;
// //         return <Inventory />;

// //       case "users":
// //         if (!permissions.users?.view) return <div>Access Denied</div>;
// //         return <UserManager />;

// //       case "roles":
// //         if (role !== "super_admin") return <div>Access Denied</div>;
// //         return <AdminRoles />;

// //       case "content":
// //         if (!permissions.content?.view) return <div>Access Denied</div>;
// //         return <ContentManager />;
      
// //       case "payment":
// //         if (!permissions.payments?.view) return <div>Access Denied</div>
// //         return <Payment/>
      
// //       case "community":
// //         if(!permissions)
// //       default:
// //         return <AdminHome />;
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-gray-100">
// //       <AdminLayout
// //         activePage={activePage}
// //         setActivePage={setActivePage}
// //         user={user}
// //       >
// //         {renderPage()}
// //       </AdminLayout>
// //     </div>
// //   );
// // };

// // export default AdminPanel;


// import { useState, useEffect } from "react";
// import { getMyAdminProfile } from "../services/adminAPI";

// import AdminLayout from "./AdminLayout";
// import AdminHome from "./pages/AdminHome";
// import Inventory from "./pages/Inventory";
// import UserManager from "./pages/UserManager";
// import AdminRoles from "./pages/AdminRoles";
// import ContentManager from "./pages/ContentManager";
// import Payment from "./pages/Payment";
// import CommunityManagement from "./pages/CommunityManagement"; // ✅ NEW

// const AdminPanel = () => {
//   const [activePage, setActivePage] = useState("home");
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const profile = await getMyAdminProfile();
//         setUser(profile);
//       } catch (err) {
//         console.error("Failed to fetch profile", err);
//         setUser({ role: "guest", permissions: {} });
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, []);

//   const hasPermission = (perm) => !!perm;

//   const renderPage = () => {
//     if (loading) return <div>Loading...</div>;
//     if (!user) return <div>Access Denied</div>;

//     const { role, permissions } = user;

//     switch (activePage) {
//       case "inventory":
//         if (!hasPermission(permissions.products?.view))
//           return <div>Access Denied</div>;
//         return <Inventory />;

//       case "users":
//         if (!hasPermission(permissions.users?.view))
//           return <div>Access Denied</div>;
//         return <UserManager />;

//       case "roles":
//         if (role !== "super_admin") return <div>Access Denied</div>;
//         return <AdminRoles />;

//       case "content":
//         if (!hasPermission(permissions.content?.view))
//           return <div>Access Denied</div>;
//         return <ContentManager />;

//       case "payment":
//         if (!hasPermission(permissions.payments?.view))
//           return <div>Access Denied</div>;
//         return <Payment />;

//       case "community":
//         if (!hasPermission(permissions.community?.view))
//           return <div>Access Denied</div>;
//         return <CommunityManagement user={user} />;

//       default:
//         return <AdminHome />;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <AdminLayout
//         activePage={activePage}
//         setActivePage={setActivePage}
//         user={user}
//       >
//         {renderPage()}
//       </AdminLayout>
//     </div>
//   );
// };

// export default AdminPanel;

import { useState, useEffect } from "react";
import { getMyAdminProfile } from "../services/adminAPI";

import AdminLayout from "./AdminLayout";
import AdminHome from "./pages/AdminHome";
import Inventory from "./pages/Inventory";
import UserManager from "./pages/UserManager";
import AdminRoles from "./pages/AdminRoles";
import ContentManager from "./pages/ContentManager";
import Payment from "./pages/Payment";
import CommunityManagement from "./pages/CommunityManagement";

const AdminPanel = () => {
  const [activePage, setActivePage] = useState("home");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getMyAdminProfile();
        setUser(profile);
      } catch (err) {
        console.error("Failed to fetch profile", err);
        setUser({ role: "guest", permissions: {} });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const hasPermission = (perm) => !!perm;

  const renderPage = () => {
    if (loading) return <div>Loading...</div>;
    if (!user) return <div>Access Denied</div>;

    const { role, permissions } = user;
    const isSuperAdmin = role === "super_admin"; // ✅ reusable flag

    switch (activePage) {
      case "inventory":
        if (!isSuperAdmin && !hasPermission(permissions.products?.view))
          return <div>Access Denied</div>;
        return <Inventory />;

      case "users":
        if (!isSuperAdmin && !hasPermission(permissions.users?.view))
          return <div>Access Denied</div>;
        return <UserManager />;

      case "roles":
        if (!isSuperAdmin) return <div>Access Denied</div>;
        return <AdminRoles />;

      case "content":
        if (!isSuperAdmin && !hasPermission(permissions.content?.view))
          return <div>Access Denied</div>;
        return <ContentManager />;

      case "payment":
        if (!isSuperAdmin && !hasPermission(permissions.payments?.view))
          return <div>Access Denied</div>;
        return <Payment />;

      case "community":
        // ✅ FIXED: super_admin bypasses permission check
        if (!isSuperAdmin && !hasPermission(permissions.community?.view))
          return <div>Access Denied</div>;
        return <CommunityManagement user={user} />;

      default:
        return <AdminHome />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminLayout
        activePage={activePage}
        setActivePage={setActivePage}
        user={user}
      >
        {renderPage()}
      </AdminLayout>
    </div>
  );
};

export default AdminPanel;
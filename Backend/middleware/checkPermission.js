// // ///file locoation: Final_Year_Project/Backend/middleware/checkPermission.js
// // module.exports = function checkPermission(moduleName, action) {
// //   return (req, res, next) => {
// //     try {
// //       const user = req.user;

// //       if (!user) {
// //         return res.status(401).json({ message: "Unauthorized" });
// //       }

// //       // Super admin bypass
// //       if (user.role === "super_admin") {
// //         return next();
// //       }

// //       const permissions = user.permissions?.[moduleName];

// //       if (!permissions || !permissions[action]) {
// //         return res.status(403).json({
// //           message: `Access denied: ${moduleName}.${action} permission required`,
// //         });
// //       }

// //       next();
// //     } catch (err) {
// //       console.error("Permission error:", err);
// //       res.status(500).json({ message: "Permission check failed" });
// //     }
// //   };
// // };

// // Final_Year_Project/Backend/middleware/checkPermission.js
// module.exports = function checkPermission(moduleName, action) {
//   return async (req, res, next) => {
//     try {
//       const user = req.user;

//       if (!user) {
//         return res.status(401).json({ message: "Unauthorized" });
//       }

//       // Super admin bypass
//       if (user.role === "super_admin") {
//         return next();
//       }

//       // Only admin accounts have permissions via department
//       if (user.role !== "admin") {
//         return res.status(403).json({
//           message: `Access denied: only admins can access ${moduleName}.${action}`,
//         });
//       }

//       // Merge department default permissions with user-specific overrides
//       let mergedPermissions = {};

//       // Department defaults (ensure populated)
//       if (user.department?.permissions) {
//         mergedPermissions = { ...user.department.permissions };
//       }

//       // User-specific overrides
//       if (user.permissions) {
//         Object.keys(user.permissions).forEach((mod) => {
//           mergedPermissions[mod] = {
//             ...mergedPermissions[mod],
//             ...user.permissions[mod],
//           };
//         });
//       }

//       const perms = mergedPermissions[moduleName];

//       if (!perms || !perms[action]) {
//         return res.status(403).json({
//           message: `Access denied: ${moduleName}.${action} permission required`,
//         });
//       }

//       next();
//     } catch (err) {
//       console.error("Permission error:", err);
//       res.status(500).json({ message: "Permission check failed" });
//     }
//   };
// };


// Final_Year_Project/Backend/middleware/checkPermission.js
module.exports = function checkPermission(moduleName, action) {
  return (req, res, next) => {
    try {
      const user = req.user;

      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Super admin bypass
      if (user.role === "super_admin") {
        return next();
      }

      // Only admins have permissions
      if (user.role !== "admin") {
        return res.status(403).json({
          message: `Access denied: only admins can access ${moduleName}.${action}`,
        });
      }

      const perms = user.permissions?.[moduleName];

      if (!perms || perms[action] !== true) {
        return res.status(403).json({
          message: `Access denied: ${moduleName}.${action} permission required`,
        });
      }

      next();
    } catch (err) {
      console.error("Permission error:", err);
      res.status(500).json({ message: "Permission check failed" });
    }
  };
};

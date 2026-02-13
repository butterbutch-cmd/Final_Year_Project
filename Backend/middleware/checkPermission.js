// // Final_Year_Project/Backend/middleware/checkPermission.js
// module.exports = function checkPermission(moduleName, action) {
//   return (req, res, next) => {
//     try {
//       const user = req.user;

//       if (!user) {
//         return res.status(401).json({ message: "Unauthorized" });
//       }

//       // Super admin bypass
//       if (user.role === "super_admin") {
//         return next();
//       }

//       // Only admins have permissions
//       if (user.role !== "admin") {
//         return res.status(403).json({
//           message: `Access denied: only admins can access ${moduleName}.${action}`,
//         });
//       }

//       const perms = user.permissions?.[moduleName];

//       if (!perms || perms[action] !== true) {
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

      // Normalize access to support both Map (Mongoose) and plain object
      let permsForModule = null;

      if (user.permissions) {
        // If it's a Map (Mongoose Map behaves like Map), use .get
        if (typeof user.permissions.get === "function") {
          permsForModule = user.permissions.get(moduleName);
        } else {
          // Plain object
          permsForModule = user.permissions[moduleName];
        }
      }

      if (!permsForModule || permsForModule[action] !== true) {
        return res.status(403).json({
          message: `Access denied: ${moduleName}.${action} permission required`,
        });
      }

      return next();
    } catch (err) {
      console.error("Permission error:", err);
      return res.status(500).json({ message: "Permission check failed" });
    }
  };
};

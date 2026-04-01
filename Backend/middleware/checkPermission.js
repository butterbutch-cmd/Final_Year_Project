const { User } = require("../models/User");

module.exports = function checkPermission(moduleName, action) {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // 🔥 Fetch fresh user from DB
      const dbUser = await User.findById(req.user._id);

      if (!dbUser) {
        return res.status(401).json({ message: "User not found" });
      }

      // Super admin bypass
      if (dbUser.role === "super_admin") {
        return next();
      }

      if (dbUser.role !== "admin") {
        return res.status(403).json({
          message: `Access denied: only admins can access ${moduleName}.${action}`,
        });
      }

      const permsForModule = dbUser.permissions.get(moduleName);

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

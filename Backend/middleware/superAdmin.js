module.exports = function (req, res, next) {
  if (!req.user) return res.status(401).send("Access denied. No user.");

  if (req.user.role !== "super_admin") {
    return res.status(403).send("Access denied. Super Admin only.");
  }

  next();
};

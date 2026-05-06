function requireRole(...allowedRoles) {
  return function roleMiddleware(req, res, next) {
    const role = req.user?.role;
    if (!role) return res.status(403).json({ message: "Forbidden" });
    if (!allowedRoles.includes(role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    return next();
  };
}

module.exports = { requireRole };


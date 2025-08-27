const { authenticate, requireRole } = require("../utils/jwt");

// Middleware to check if the user is an admin
const adminOnly = [authenticate, requireRole("admin", "superAdmin")];

module.exports = adminOnly;

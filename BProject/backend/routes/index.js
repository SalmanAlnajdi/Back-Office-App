// src/routes/index.js
const express = require("express");
const router = express.Router();

// Import feature routes
const customerRoutes = require("../api/customer/routes");
const authRoutes = require("../api/auth/routes");
const adminRoutes = require("../api/auth/routes");

// Mount them
router.use("/customers", customerRoutes);
router.use("/auth", authRoutes);
router.use("/admins", adminRoutes);

module.exports = router;

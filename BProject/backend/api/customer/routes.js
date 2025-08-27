// api/customer/routes.js
const express = require("express");
const router = express.Router();
const {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} = require("./controllers");
const adminOnly = require("../../middlewares/adminOnly");

router.get("/", getCustomers);
router.get("/:id", adminOnly, getCustomer);
router.post("/", adminOnly, createCustomer);
router.put("/:id", adminOnly, updateCustomer);
router.delete("/:id", adminOnly, deleteCustomer);

module.exports = router;

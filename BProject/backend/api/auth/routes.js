// src/api/auth/routes.js
const router = require("express").Router();
const { authenticate } = require("../../utils/jwt");
const { register, login, refresh, me } = require("./controllers");

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.get("/me", authenticate, me);

module.exports = router;

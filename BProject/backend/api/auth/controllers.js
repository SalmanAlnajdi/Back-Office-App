// src/api/auth/controllers.js
const Admin = require("../../models/Admin");
const { issueTokenPair, verifyRefreshToken } = require("../../utils/jwt");

// register
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res
        .status(400)
        .json({ message: "name, email, password are required" });

    const exists = await Admin.findOne({ email });
    if (exists)
      return res.status(409).json({ message: "Email already in use" });

    const admin = await Admin.create({ name, email, password });
    const tokens = issueTokenPair(admin);
    res.status(201).json({
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: "admin" || admin.role,
      },
      ...tokens,
    });
  } catch (e) {
    next(e);
  }
};

// login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "email and password are required" });

    const admin = await Admin.findOne({ email }).select("+password");
    if (!admin) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await admin.comparePassword(password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const tokens = issueTokenPair(admin);
    res.json({
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
      ...tokens,
    });
  } catch (e) {
    next(e);
  }
};

// refresh
exports.refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(400).json({ message: "Missing refreshToken" });
    const decoded = verifyRefreshToken(refreshToken); // throws if invalid
    const tokens = issueTokenPair({ _id: decoded.sub, role: decoded.role });
    res.json(tokens);
  } catch {
    res.status(401).json({ message: "Invalid or expired refresh token" });
  }
};

// me (protected)
exports.me = async (req, res) => {
  res.json({ user: req.user });
};

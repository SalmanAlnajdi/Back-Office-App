// src/utils/jwt.js
require("dotenv").config();
const jwt = require("jsonwebtoken");

const {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_TTL = "15m",
  REFRESH_TOKEN_TTL = "7d",
} = process.env;

if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
  throw new Error(
    "JWT secrets are missing. Set ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET in .env"
  );
}

// Sign helpers
function signAccessToken(payload = {}, options = {}) {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_TTL,
    ...options,
  });
}

function signRefreshToken(payload = {}, options = {}) {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_TTL,
    ...options,
  });
}

// Verify helpers
function verifyAccessToken(token) {
  return jwt.verify(token, ACCESS_TOKEN_SECRET);
}

function verifyRefreshToken(token) {
  return jwt.verify(token, REFRESH_TOKEN_SECRET);
}

// Issue pair (commonly used after login/register)
function issueTokenPair(user) {
  // keep payload minimal: only what you’ll check in middleware
  const base = { sub: user._id.toString(), role: user.role || "admin" };
  return {
    accessToken: signAccessToken(base),
    refreshToken: signRefreshToken(base),
  };
}

// Extract Bearer token from Authorization header
function getTokenFromHeader(req) {
  const auth = req.headers.authorization || "";
  const [type, token] = auth.split(" ");
  if (type?.toLowerCase() === "bearer" && token) return token;
  return null;
}

// Express middleware: require valid access token
function authenticate(req, res, next) {
  try {
    const token = getTokenFromHeader(req);
    if (!token)
      return res.status(401).json({ message: "Missing Authorization header" });

    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

// Optional: role guard
function requireRole(...allowed) {
  return (req, res, next) => {
    if (!req.user?.role || !allowed.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
}

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  issueTokenPair,
  getTokenFromHeader,
  authenticate,
  requireRole,
};

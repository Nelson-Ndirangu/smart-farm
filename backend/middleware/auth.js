// Protecting the routes
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

export const authenticate = (req, res, next) => {
  try {
    // Accept "Bearer <token>" in Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "No token" });

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") return res.status(401).json({ message: "Invalid token format" });

    const token = parts[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // attach user info to request
    req.user = { id: decoded.sub, role: decoded.role };
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Unauthorized" });
  }
}

// Role-based authorization middleware
export const authorizeRole = (...allowedRoles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  if (!allowedRoles.includes(req.user.role)) return res.status(403).json({ message: "Forbidden - insufficient role" });
  next();
}

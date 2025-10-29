const express = require("express");
const User = require("../models/user");
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require("../utils/token");
const dotenv = require("dotenv");
dotenv.config();

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) return res.status(400).json({ message: "Missing fields" });
    if (!["farmer","agronomist"].includes(role)) return res.status(400).json({ message: "Invalid role" });

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: "User exists" });

    const user = new User({ name, email, password, role });
    await user.save();

    // Optionally auto-login by issuing tokens
    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    // For refresh tokens store them server-side (DB or Redis)
    return res.status(201).json({ user: { id: user._id, name: user.name, role: user.role }, accessToken, refreshToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const {email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Missing credentials" });

    const user = await User.findOne({email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    // Save refresh token to DB or Redis tied to user for revocation (recommended)
    return res.json({ accessToken, refreshToken, user: { id: user._id, name: user.name, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Refresh token endpoint
router.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: "No refresh token provided" });

    // verify (and optionally check it exists in DB/Redis)
    const decoded = verifyRefreshToken(refreshToken);
    // if verify throws, catch will handle
    const userId = decoded.sub;
    const user = await User.findById(userId);
    if (!user) return res.status(401).json({ message: "User not found" });

    const newAccessToken = signAccessToken(user);
    const newRefreshToken = signRefreshToken(user);
    // rotate refresh tokens: store new one, remove old one in DB/Redis

    return res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Invalid refresh token" });
  }
});

// Logout (simple): instruct client to delete tokens, and revoke refresh token server-side
router.post("/logout", async (req, res) => {
  const { refreshToken } = req.body;
  // remove refresh token from DB/Redis so it can't be used again
  return res.json({ message: "Logged out" });
});

module.exports = router;
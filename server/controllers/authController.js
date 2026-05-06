const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const User = require("../models/User");

function demoAdminEnabled() {
  // Disabled by default in production; opt-in via env when you really want it.
  const flag = (process.env.DEMO_ADMIN_LOGIN || "").toLowerCase();
  if (process.env.NODE_ENV === "production") return flag === "true";
  return flag !== "false"; // default on for local/dev unless explicitly disabled
}

async function getOrCreateDemoAdmin() {
  const demoEmail = process.env.DEMO_ADMIN_EMAIL || "admin@local";
  const demoName = process.env.DEMO_ADMIN_NAME || "Admin";
  const demoPassword = process.env.DEMO_ADMIN_PASSWORD || "admin";

  let user = await User.findOne({ email: demoEmail });
  if (!user) {
    const passwordHash = await bcrypt.hash(demoPassword, 10);
    user = await User.create({
      name: demoName,
      email: demoEmail,
      passwordHash,
      role: "Admin",
    });
  }

  return { user, demoPassword, demoEmail };
}

function signToken(user) {
  if (!process.env.JWT_SECRET) {
    const err = new Error("JWT_SECRET is required");
    err.statusCode = 500;
    throw err;
  }
  return jwt.sign(
    { id: user._id.toString(), role: user.role, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

async function signup(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, password, role } = req.body;

  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ message: "Email already in use" });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    passwordHash,
    role: role === "Admin" ? "Admin" : "Member",
  });

  const token = signToken(user);
  return res.status(201).json({
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
}

async function login(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const rawEmail = String(req.body.email || "").trim();
  const password = String(req.body.password || "");

  // Demo shortcut: email "admin" + password "admin"
  if (demoAdminEnabled() && rawEmail.toLowerCase() === "admin") {
    const { user, demoPassword } = await getOrCreateDemoAdmin();
    if (password !== demoPassword) return res.status(401).json({ message: "Invalid credentials" });
    const token = signToken(user);
    return res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  }

  const email = rawEmail.toLowerCase();

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const token = signToken(user);
  return res.json({
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
}

async function me(req, res) {
  const user = await User.findById(req.user.id).select("_id name email role createdAt updatedAt");
  if (!user) return res.status(404).json({ message: "User not found" });
  return res.json({ user });
}

module.exports = { signup, login, me };


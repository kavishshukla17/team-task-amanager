const express = require("express");
const { body } = require("express-validator");

const { signup, login, me } = require("../controllers/authController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/signup",
  [
    body("name").isString().trim().isLength({ min: 2, max: 80 }),
    body("email").isEmail().normalizeEmail(),
    body("password").isString().isLength({ min: 6, max: 200 }),
    body("role").optional().isIn(["Admin", "Member"]),
  ],
  signup
);

router.post(
  "/login",
  [body("email").isEmail().normalizeEmail(), body("password").isString().isLength({ min: 1 })],
  login
);

router.get("/me", authMiddleware, me);

module.exports = router;


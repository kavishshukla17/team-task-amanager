const express = require("express");
const { body, param } = require("express-validator");

const {
  createProject,
  listProjects,
  getProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(authMiddleware);
router.use(requireRole("Admin"));

router.get("/", listProjects);

router.post(
  "/",
  [
    body("name").isString().trim().isLength({ min: 2, max: 120 }),
    body("description").optional().isString().trim().isLength({ max: 2000 }),
    body("members").optional().isArray(),
  ],
  createProject
);

router.get("/:id", [param("id").isString().isLength({ min: 1 })], getProject);

router.put(
  "/:id",
  [
    param("id").isString().isLength({ min: 1 }),
    body("name").optional().isString().trim().isLength({ min: 2, max: 120 }),
    body("description").optional().isString().trim().isLength({ max: 2000 }),
    body("members").optional().isArray(),
  ],
  updateProject
);

router.delete("/:id", [param("id").isString().isLength({ min: 1 })], deleteProject);

module.exports = router;


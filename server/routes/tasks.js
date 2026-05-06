const express = require("express");
const { body, param, query } = require("express-validator");

const { createTask, listTasks, getTask, updateTask, deleteTask } = require("../controllers/taskController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.get(
  "/",
  [
    query("projectId").optional().isString().isLength({ min: 1 }),
    query("status").optional().isIn(["Todo", "InProgress", "Done"]),
    query("assignedTo").optional().isString().isLength({ min: 1 }),
    query("overdue").optional().isIn(["true", "false"]),
  ],
  listTasks
);

router.post(
  "/",
  requireRole("Admin"),
  [
    body("project").isString().isLength({ min: 1 }),
    body("title").isString().trim().isLength({ min: 2, max: 200 }),
    body("description").optional().isString().trim().isLength({ max: 5000 }),
    body("status").optional().isIn(["Todo", "InProgress", "Done"]),
    body("priority").optional().isIn(["Low", "Medium", "High"]),
    body("dueDate").optional({ nullable: true }).isISO8601(),
    body("assignedTo").optional({ nullable: true }).isString().isLength({ min: 1 }),
  ],
  createTask
);

router.get("/:id", [param("id").isString().isLength({ min: 1 })], getTask);

router.put(
  "/:id",
  [
    param("id").isString().isLength({ min: 1 }),
    body("project").optional().isString().isLength({ min: 1 }),
    body("title").optional().isString().trim().isLength({ min: 2, max: 200 }),
    body("description").optional().isString().trim().isLength({ max: 5000 }),
    body("status").optional().isIn(["Todo", "InProgress", "Done"]),
    body("priority").optional().isIn(["Low", "Medium", "High"]),
    body("dueDate").optional({ nullable: true }).isISO8601(),
    body("assignedTo").optional({ nullable: true }).isString().isLength({ min: 1 }),
  ],
  updateTask
);

router.delete("/:id", requireRole("Admin"), [param("id").isString().isLength({ min: 1 })], deleteTask);

module.exports = router;


const { validationResult } = require("express-validator");

const Task = require("../models/Task");
const Project = require("../models/Project");

async function createTask(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { project, title, description = "", status, priority, dueDate, assignedTo } = req.body;

  const exists = await Project.findById(project).select("_id");
  if (!exists) return res.status(404).json({ message: "Project not found" });

  const task = await Task.create({
    project,
    title,
    description,
    status,
    priority,
    dueDate: dueDate ? new Date(dueDate) : null,
    assignedTo: assignedTo || null,
    createdBy: req.user.id,
  });

  const populated = await Task.findById(task._id)
    .populate("project", "_id name")
    .populate("assignedTo", "_id name email role")
    .populate("createdBy", "_id name email role");

  return res.status(201).json({ task: populated });
}

async function listTasks(req, res) {
  const { projectId, status, assignedTo, overdue } = req.query;

  const filter = {};
  if (projectId) filter.project = projectId;
  if (status) filter.status = status;
  if (assignedTo) filter.assignedTo = assignedTo;
  if (overdue === "true") {
    filter.dueDate = { $lt: new Date() };
    filter.status = { $ne: "Done" };
  }

  const tasks = await Task.find(filter)
    .sort({ createdAt: -1 })
    .populate("project", "_id name")
    .populate("assignedTo", "_id name email role")
    .populate("createdBy", "_id name email role");

  return res.json({ tasks });
}

async function getTask(req, res) {
  const task = await Task.findById(req.params.id)
    .populate("project", "_id name")
    .populate("assignedTo", "_id name email role")
    .populate("createdBy", "_id name email role");

  if (!task) return res.status(404).json({ message: "Task not found" });
  return res.json({ task });
}

async function updateTask(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const isAdmin = req.user.role === "Admin";

  if (!isAdmin) {
    const task = await Task.findById(req.params.id).select("_id assignedTo");
    if (!task) return res.status(404).json({ message: "Task not found" });
    if (!task.assignedTo || task.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const updates = {};
    if ("status" in req.body) updates.status = req.body.status;
    if ("description" in req.body) updates.description = req.body.description;

    const updated = await Task.findByIdAndUpdate(req.params.id, updates, { new: true })
      .populate("project", "_id name")
      .populate("assignedTo", "_id name email role")
      .populate("createdBy", "_id name email role");

    return res.json({ task: updated });
  }

  const updates = {};
  const allowed = ["title", "description", "status", "priority", "dueDate", "assignedTo", "project"];
  for (const key of allowed) {
    if (key in req.body) updates[key] = req.body[key];
  }
  if ("dueDate" in updates) updates.dueDate = updates.dueDate ? new Date(updates.dueDate) : null;
  if ("assignedTo" in updates) updates.assignedTo = updates.assignedTo || null;

  if ("project" in updates) {
    const exists = await Project.findById(updates.project).select("_id");
    if (!exists) return res.status(404).json({ message: "Project not found" });
  }

  const task = await Task.findByIdAndUpdate(req.params.id, updates, { new: true })
    .populate("project", "_id name")
    .populate("assignedTo", "_id name email role")
    .populate("createdBy", "_id name email role");

  if (!task) return res.status(404).json({ message: "Task not found" });
  return res.json({ task });
}

async function deleteTask(req, res) {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found" });
  return res.json({ ok: true });
}

module.exports = { createTask, listTasks, getTask, updateTask, deleteTask };


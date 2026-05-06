const { validationResult } = require("express-validator");

const Project = require("../models/Project");

async function createProject(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, description = "", members = [] } = req.body;

  const project = await Project.create({
    name,
    description,
    createdBy: req.user.id,
    members: Array.isArray(members) ? members : [],
  });

  return res.status(201).json({ project });
}

async function listProjects(req, res) {
  const projects = await Project.find({})
    .sort({ createdAt: -1 })
    .populate("createdBy", "_id name email role")
    .populate("members", "_id name email role");
  return res.json({ projects });
}

async function getProject(req, res) {
  const project = await Project.findById(req.params.id)
    .populate("createdBy", "_id name email role")
    .populate("members", "_id name email role");
  if (!project) return res.status(404).json({ message: "Project not found" });
  return res.json({ project });
}

async function updateProject(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const updates = {};
  const allowed = ["name", "description", "members"];
  for (const key of allowed) {
    if (key in req.body) updates[key] = req.body[key];
  }
  if ("members" in updates && !Array.isArray(updates.members)) updates.members = [];

  const project = await Project.findByIdAndUpdate(req.params.id, updates, { new: true })
    .populate("createdBy", "_id name email role")
    .populate("members", "_id name email role");

  if (!project) return res.status(404).json({ message: "Project not found" });
  return res.json({ project });
}

async function deleteProject(req, res) {
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) return res.status(404).json({ message: "Project not found" });
  return res.json({ ok: true });
}

module.exports = { createProject, listProjects, getProject, updateProject, deleteProject };


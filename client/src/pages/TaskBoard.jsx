import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext.jsx";
import TaskCard from "../components/TaskCard.jsx";

const COLUMNS = [
  { key: "Todo", label: "Todo" },
  { key: "InProgress", label: "In Progress" },
  { key: "Done", label: "Done" },
];

export default function TaskBoard() {
  const { projectId } = useParams();
  const { user } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [busy, setBusy] = useState(false);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const [tasksRes, projectRes] = await Promise.all([
        api.get("/api/tasks", { params: { projectId } }),
        api.get(`/api/projects/${projectId}`),
      ]);
      setTasks(tasksRes.data.tasks || []);
      setProject(projectRes.data.project || null);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load board");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const grouped = useMemo(() => {
    const map = { Todo: [], InProgress: [], Done: [] };
    for (const t of tasks) (map[t.status] || map.Todo).push(t);
    return map;
  }, [tasks]);

  async function createTask(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api.post("/api/tasks", { project: projectId, title, description, priority });
      setTitle("");
      setDescription("");
      setPriority("Medium");
      await load();
    } catch (err) {
      setError(err?.response?.data?.message || err?.response?.data?.errors?.[0]?.msg || "Failed to create task (Admin only)");
    } finally {
      setBusy(false);
    }
  }

  async function moveTask(task, status) {
    setError("");
    try {
      await api.put(`/api/tasks/${task._id}`, { status });
      await load();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update task");
    }
  }

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-semibold">{project?.name || "Task board"}</h1>
        <p className="mt-1 text-sm text-black/60">
          {user?.role === "Admin"
            ? "Admins can create tasks and manage everything."
            : "Members can update status/description only for tasks assigned to them."}
        </p>
      </div>

      {error ? (
        <div className="rounded-md border border-black/10 bg-black/5 px-3 py-2 text-sm text-black">{error}</div>
      ) : null}

      {user?.role === "Admin" ? (
        <form onSubmit={createTask} className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
          <div className="grid gap-3 md:grid-cols-3">
            <label className="block text-sm text-black/80 md:col-span-1">
              Title
              <input
                className="mt-1 w-full rounded-md border border-black/15 bg-white px-3 py-2 outline-none hover:border-black/30"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </label>
            <label className="block text-sm text-black/80 md:col-span-1">
              Priority
              <select
                className="mt-1 w-full rounded-md border border-black/15 bg-white px-3 py-2 outline-none hover:border-black/30"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </label>
            <label className="block text-sm text-black/80 md:col-span-1">
              Description
              <input
                className="mt-1 w-full rounded-md border border-black/15 bg-white px-3 py-2 outline-none hover:border-black/30"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </label>
          </div>
          <button
            disabled={busy}
            className="mt-4 rounded-md bg-black px-3 py-2 text-sm font-semibold text-white hover:bg-black/90 disabled:opacity-60"
          >
            {busy ? "Creating…" : "Create task"}
          </button>
        </form>
      ) : null}

      {loading ? (
        <div className="text-black/70">Loading…</div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          {COLUMNS.map((col) => (
            <div key={col.key} className="rounded-2xl border border-black/10 bg-white shadow-sm">
              <div className="border-b border-black/10 px-4 py-3">
                <div className="text-sm font-semibold">{col.label}</div>
                <div className="text-xs text-black/60">{grouped[col.key].length} tasks</div>
              </div>
              <div className="grid gap-3 p-3">
                {grouped[col.key].map((t) => (
                  <div key={t._id} className="grid gap-2">
                    <TaskCard task={t} />
                    <div className="flex gap-2">
                      {COLUMNS.filter((c) => c.key !== col.key).map((c) => (
                        <button
                          key={c.key}
                          onClick={() => moveTask(t, c.key)}
                          className="rounded-md border border-black/10 bg-white px-2 py-1 text-xs font-medium text-black hover:bg-black hover:text-white"
                        >
                          Move → {c.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                {grouped[col.key].length === 0 ? <div className="text-sm text-black/50">Empty</div> : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


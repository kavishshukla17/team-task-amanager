import React, { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext.jsx";

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white px-4 py-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="text-sm text-black/60">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get("/api/tasks");
        if (!cancelled) setTasks(data.tasks || []);
      } catch (err) {
        if (!cancelled) setError(err?.response?.data?.message || "Failed to load tasks");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const stats = useMemo(() => {
    const total = tasks.length;
    const todo = tasks.filter((t) => t.status === "Todo").length;
    const inProgress = tasks.filter((t) => t.status === "InProgress").length;
    const done = tasks.filter((t) => t.status === "Done").length;
    const overdue = tasks.filter((t) => t.dueDate && new Date(t.dueDate).getTime() < Date.now() && t.status !== "Done").length;
    return { total, todo, inProgress, done, overdue };
  }, [tasks]);

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="mt-1 text-sm text-black/60">
          Signed in as <span className="text-black">{user?.name}</span> ({user?.role})
        </p>
      </div>

      {error ? (
        <div className="rounded-md border border-black/10 bg-black/5 px-3 py-2 text-sm text-black">{error}</div>
      ) : null}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Stat label="Total tasks" value={loading ? "…" : stats.total} />
        <Stat label="Todo" value={loading ? "…" : stats.todo} />
        <Stat label="In progress" value={loading ? "…" : stats.inProgress} />
        <Stat label="Done" value={loading ? "…" : stats.done} />
        <Stat label="Overdue" value={loading ? "…" : stats.overdue} />
      </div>

      <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm transition hover:shadow-md">
        <div className="text-sm text-black/60">Tip</div>
        <div className="mt-1 text-black">
          {user?.role === "Admin"
            ? "As Admin you can create projects and tasks, then assign tasks to members."
            : "As Member you can update status/description for tasks assigned to you."}
        </div>
      </div>
    </div>
  );
}


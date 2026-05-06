import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext.jsx";

export default function Projects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/api/projects");
      setProjects(data.projects || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load projects (Admin only)");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function createProject(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api.post("/api/projects", { name, description });
      setName("");
      setDescription("");
      await load();
    } catch (err) {
      setError(err?.response?.data?.message || err?.response?.data?.errors?.[0]?.msg || "Failed to create project");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Projects</h1>
        <p className="mt-1 text-sm text-black/60">
          {user?.role === "Admin" ? "Create a project and open its task board." : "Projects are Admin-only in this demo."}
        </p>
      </div>

      {error ? (
        <div className="rounded-md border border-black/10 bg-black/5 px-3 py-2 text-sm text-black">{error}</div>
      ) : null}

      {user?.role === "Admin" ? (
        <form onSubmit={createProject} className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
          <div className="grid gap-3 md:grid-cols-2">
            <label className="block text-sm text-black/80">
              Project name
              <input
                className="mt-1 w-full rounded-md border border-black/15 bg-white px-3 py-2 outline-none hover:border-black/30"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>
            <label className="block text-sm text-black/80">
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
            {busy ? "Creating…" : "Create project"}
          </button>
        </form>
      ) : null}

      <div className="grid gap-3">
        {loading ? (
          <div className="text-black/70">Loading…</div>
        ) : projects.length ? (
          projects.map((p) => (
            <div key={p._id} className="rounded-2xl border border-black/10 bg-white px-4 py-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-medium">{p.name}</div>
                  {p.description ? <div className="mt-1 text-sm text-black/60">{p.description}</div> : null}
                </div>
                <Link
                  to={`/projects/${p._id}/tasks`}
                  className="rounded-md bg-black px-3 py-2 text-sm font-medium text-white hover:bg-black/90"
                >
                  Open board
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="text-black/60">No projects yet.</div>
        )}
      </div>
    </div>
  );
}


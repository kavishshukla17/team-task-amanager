import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Member");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await signup({ name, email, password, role });
      navigate("/dashboard");
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data?.errors?.[0]?.msg || "Signup failed";
      setError(msg);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto grid max-w-md gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Create your account</h1>
        <p className="mt-1 text-sm text-black/60">Start managing team projects and tasks.</p>
      </div>

      <form onSubmit={onSubmit} className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
        {error ? (
          <div className="mb-3 rounded-md border border-black/10 bg-black/5 px-3 py-2 text-sm text-black">
            {error}
          </div>
        ) : null}

        <label className="block text-sm text-black/80">
          Name
          <input
            className="mt-1 w-full rounded-md border border-black/15 bg-white px-3 py-2 outline-none hover:border-black/30"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

        <label className="mt-3 block text-sm text-black/80">
          Email
          <input
            className="mt-1 w-full rounded-md border border-black/15 bg-white px-3 py-2 outline-none hover:border-black/30"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
          />
        </label>

        <label className="mt-3 block text-sm text-black/80">
          Password
          <input
            className="mt-1 w-full rounded-md border border-black/15 bg-white px-3 py-2 outline-none hover:border-black/30"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
            minLength={6}
          />
        </label>

        <label className="mt-3 block text-sm text-black/80">
          Role
          <select
            className="mt-1 w-full rounded-md border border-black/15 bg-white px-3 py-2 outline-none hover:border-black/30"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="Member">Member</option>
            <option value="Admin">Admin</option>
          </select>
          <p className="mt-1 text-xs text-black/60">
            For demo purposes you can choose Admin to manage projects.
          </p>
        </label>

        <button
          disabled={busy}
          className="mt-4 w-full rounded-md bg-black px-3 py-2 text-sm font-semibold text-white hover:bg-black/90 disabled:opacity-60"
        >
          {busy ? "Creating…" : "Signup"}
        </button>

        <p className="mt-3 text-sm text-black/60">
          Already have an account?{" "}
          <Link className="font-medium text-black underline-offset-4 hover:underline" to="/login">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}


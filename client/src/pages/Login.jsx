import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await login({ email, password });
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto grid max-w-md gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Welcome back</h1>
        <p className="mt-1 text-sm text-black/60">Log in to manage projects and tasks.</p>
      </div>

      <form onSubmit={onSubmit} className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
        {error ? (
          <div className="mb-3 rounded-md border border-black/10 bg-black/5 px-3 py-2 text-sm text-black">
            {error}
          </div>
        ) : null}

        <label className="block text-sm text-black/80">
          Email (or <span className="font-medium">admin</span>)
          <input
            className="mt-1 w-full rounded-md border border-black/15 bg-white px-3 py-2 outline-none hover:border-black/30"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            placeholder="you@example.com or admin"
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
          />
        </label>

        <button
          disabled={busy}
          className="mt-4 w-full rounded-md bg-black px-3 py-2 text-sm font-semibold text-white hover:bg-black/90 disabled:opacity-60"
        >
          {busy ? "Logging in…" : "Login"}
        </button>

        <p className="mt-3 text-sm text-black/60">
          New here?{" "}
          <Link className="font-medium text-black underline-offset-4 hover:underline" to="/signup">
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
}


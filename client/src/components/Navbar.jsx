import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function Item({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
          isActive
            ? "bg-black text-white"
            : "text-black/70 hover:bg-black hover:text-white"
        }`
      }
    >
      {children}
    </NavLink>
  );
}

export default function Navbar() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-10 border-b border-black/10 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/dashboard" className="font-semibold tracking-tight">
          Team Task Manager
        </Link>

        <nav className="flex items-center gap-2">
          {token ? (
            <>
              <Item to="/dashboard">Dashboard</Item>
              <Item to="/projects">Projects</Item>
              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="rounded-md bg-black px-3 py-2 text-sm font-medium text-white hover:bg-black/90"
              >
                Logout
              </button>
              <span className="hidden text-sm text-black/60 sm:block">
                {user?.name} · {user?.role}
              </span>
            </>
          ) : (
            <>
              <Item to="/login">Login</Item>
              <Item to="/signup">Signup</Item>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}


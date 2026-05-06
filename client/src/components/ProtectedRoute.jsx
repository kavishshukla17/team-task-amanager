import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();

  if (loading) return <div className="text-slate-300">Loading…</div>;
  if (!token) return <Navigate to="/login" replace />;

  return children;
}


import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const raw = localStorage.getItem("aroma_user") || localStorage.getItem("aroma_current_user");
  if (!raw) return <Navigate to="/login" replace />;
  return children;
}

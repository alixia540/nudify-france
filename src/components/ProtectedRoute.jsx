import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  // Si pas connecté → redirige vers la page de connexion
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Sinon, autorise l’accès à la page
  return children;
}

import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";

import Home from "./pages/Home";
import Tarifs from "./pages/Tarifs";
import AvantApres from "./pages/AvantApres";
import Support from "./pages/Support";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MonEspace from "./pages/MonEspace"; // ✅ c’est bien ce composant

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  // ✅ Vérifie le token une seule fois
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  // ⏳ Petit écran d’attente
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#1E1E2F] text-white flex items-center justify-center text-xl">
        Chargement...
      </div>
    );
  }

  return (
    <Router>
      <Layout>
        <Routes>
          {/* 🌍 Pages publiques */}
          <Route path="/" element={<Home />} />
          <Route path="/tarifs" element={<Tarifs />} />
          <Route path="/avant-apres" element={<AvantApres />} />
          <Route path="/support" element={<Support />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* 🔒 Page protégée */}
          <Route
            path="/mon-espace"
            element={
              localStorage.getItem("token") ? (
                <MonEspace />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* 🔁 Route par défaut */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

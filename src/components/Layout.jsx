import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Layout({ children }) {
  const [credits, setCredits] = useState(0);
  const email = "demo@nudify.fr"; // ➜ à remplacer plus tard par l'email utilisateur connecté

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const res = await fetch(`https://nudify-backend.onrender.com/api/credits/${email}`);
        if (!res.ok) throw new Error("Erreur réseau");
        const data = await res.json();
        setCredits(data.credits || 0);
      } catch (err) {
        console.error("Erreur récupération crédits :", err);
        setCredits(0);
      }
    };

    fetchCredits();
    // ✅ met à jour les crédits toutes les 10 secondes automatiquement
    const interval = setInterval(fetchCredits, 10000);
    return () => clearInterval(interval);
  }, [email]);

  return (
    <div className="min-h-screen bg-[#1E1E2F] text-white flex flex-col">
      {/* HEADER */}
      <header className="p-4 flex justify-between items-center bg-[#252542] shadow-lg sticky top-0 z-50">
        {/* Logo + Nom */}
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="Nudify France"
            className="w-28 h-auto object-contain"
          />
          <h1 className="font-bold text-lg tracking-wide">Nudify France</h1>
        </div>

        {/* Navigation */}
        <nav className="hidden sm:flex space-x-6">
          <Link to="/" className="hover:text-blue-400 transition-colors">Accueil</Link>
          <Link to="/tarifs" className="hover:text-blue-400 transition-colors">Tarifs</Link>
          <Link to="/avant-apres" className="hover:text-blue-400 transition-colors">Avant / Après</Link>
          <Link to="/support" className="hover:text-blue-400 transition-colors">Support</Link>
        </nav>

        {/* Crédits réels */}
        <div className="bg-gradient-to-r from-blue-600 to-pink-500 px-5 py-2 rounded-full text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-300">
          💰 {credits} crédits
        </div>
      </header>

      {/* CONTENU */}
      <main className="flex-grow p-6">{children}</main>

      {/* FOOTER */}
      <footer className="text-center text-gray-500 py-4 text-sm border-t border-white/10">
        © {new Date().getFullYear()} Nudify France — Tous droits réservés
      </footer>
    </div>
  );
}


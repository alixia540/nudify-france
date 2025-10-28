import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Layout({ children }) {
  const [credits, setCredits] = useState(0);
  const [userEmail, setUserEmail] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  const email = localStorage.getItem("email") || null;

  const API_BASE =
    window.location.hostname === "localhost"
      ? "http://localhost:10000"
      : "https://nudify-backend.onrender.com";

  // 📊 Récupération des crédits utilisateur
  useEffect(() => {
    if (!email) return;

    setUserEmail(email);
    fetch(`${API_BASE}/api/credits/${email}`, {
      headers: { "x-api-key": "NUDIFY_SUPER_SECRET_2025" },
    })
      .then((res) => res.json())
      .then((data) => setCredits(data.credits || 0))
      .catch(() => setCredits(0));
  }, [email]);

  // 🎢 Effet au scroll (réduction du header)
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🚪 Déconnexion
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    alert("👋 Déconnecté avec succès !");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#1E1E2F] text-white">
      {/* 🔝 Barre du haut */}
      <header
        className={`fixed top-0 left-0 w-full bg-[#252542] shadow-lg flex items-center justify-between px-6 md:px-10 transition-all duration-300 z-50 ${
          scrolled ? "py-3 backdrop-blur-sm bg-opacity-90" : "py-5"
        }`}
      >
        {/* Logo + Titre */}
        <Link
          to="/"
          className="flex items-center space-x-3 hover:opacity-90 transition"
          onClick={() => setMenuOpen(false)}
        >
          <img
            src={logo}
            alt="Nudify Logo"
            className={`object-contain select-none transition-all duration-300 ${
              scrolled ? "w-10 h-10" : "w-12 h-12"
            }`}
          />
          <h1
            className={`font-bold transition-all duration-300 ${
              scrolled ? "text-lg" : "text-xl"
            } text-white`}
          >
            Nudify France
          </h1>
        </Link>

        {/* Navigation desktop */}
        <nav className="hidden md:flex space-x-6 text-sm lg:text-base items-center">
          <Link to="/" className="hover:text-blue-400">Accueil</Link>
          <Link to="/tarifs" className="hover:text-blue-400">Tarifs</Link>
          <Link to="/avant-apres" className="hover:text-blue-400">Avant / Après</Link>
          <Link to="/support" className="hover:text-blue-400">Support</Link>

          {/* ✅ Mon espace visible si connecté */}
          {localStorage.getItem("token") && (
            <Link to="/mon-espace" className="hover:text-blue-400">
              Mon espace
            </Link>
          )}

          {!localStorage.getItem("token") ? (
            <>
              <Link to="/login" className="hover:text-pink-400 font-semibold">
                Connexion
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-blue-500 to-pink-500 px-4 py-2 rounded-full font-semibold text-white hover:opacity-90 transition"
              >
                S’inscrire
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-full text-sm font-semibold transition"
            >
              Déconnexion
            </button>
          )}
        </nav>

        {/* Crédits + email + menu mobile */}
        <div className="flex items-center space-x-4">
          {userEmail && (
            <span className="text-gray-300 text-sm hidden sm:block truncate max-w-[140px]">
              {userEmail}
            </span>
          )}

          <span className="bg-blue-600 px-5 py-2 rounded-full text-sm font-semibold shadow-md whitespace-nowrap">
            💰 {credits} crédits
          </span>

          {/* Menu mobile */}
          <button
            className="md:hidden text-2xl focus:outline-none select-none"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Ouvrir le menu"
          >
            {menuOpen ? "✖" : "☰"}
          </button>
        </div>
      </header>

      {/* ✅ Menu mobile corrigé */}
      {menuOpen && (
        <div className="fixed top-20 left-0 w-full bg-[#1E1E2F] flex flex-col items-center space-y-4 py-6 z-40 border-t border-gray-700">
          <Link to="/" className="text-lg hover:text-blue-400" onClick={() => setMenuOpen(false)}>Accueil</Link>
          <Link to="/tarifs" className="text-lg hover:text-blue-400" onClick={() => setMenuOpen(false)}>Tarifs</Link>
          <Link to="/avant-apres" className="text-lg hover:text-blue-400" onClick={() => setMenuOpen(false)}>Avant / Après</Link>
          <Link to="/support" className="text-lg hover:text-blue-400" onClick={() => setMenuOpen(false)}>Support</Link>

          {/* ✅ Mon espace visible uniquement si connecté */}
          {localStorage.getItem("token") && (
            <Link
              to="/mon-espace"
              className="text-lg hover:text-blue-400"
              onClick={() => setMenuOpen(false)}
            >
              Mon espace
            </Link>
          )}

          {!localStorage.getItem("token") ? (
            <>
              <Link
                to="/login"
                className="text-lg hover:text-pink-400 font-semibold"
                onClick={() => setMenuOpen(false)}
              >
                Connexion
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-blue-500 to-pink-500 px-6 py-2 rounded-lg text-white font-semibold"
                onClick={() => setMenuOpen(false)}
              >
                S’inscrire
              </Link>
            </>
          ) : (
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="bg-red-600 px-5 py-2 rounded-lg text-white font-semibold"
            >
              Déconnexion
            </button>
          )}
        </div>
      )}

      {/* Contenu principal */}
      <main className="pt-24 p-6">{children}</main>
    </div>
  );
}


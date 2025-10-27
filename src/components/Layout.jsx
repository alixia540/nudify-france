import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Layout({ children }) {
  const [credits, setCredits] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const email = "demo@nudify.fr";

  // 🎯 Fetch crédits
  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const res = await fetch(`https://nudify-backend.onrender.com/api/credits/${email}`);
        if (!res.ok) throw new Error("Erreur réseau");
        const data = await res.json();
        setCredits(data.credits || 0);
      } catch {
        setCredits(0);
      }
    };

    fetchCredits();
    const interval = setInterval(fetchCredits, 10000);
    return () => clearInterval(interval);
  }, [email]);

  // 🎢 Réduction du header au scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🎛️ Toggle menu mobile
  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <div className="min-h-screen bg-[#1E1E2F] text-white flex flex-col">
      {/* HEADER */}
      <header
        className={`fixed top-0 left-0 w-full z-50 bg-[#252542] shadow-md flex justify-between items-center transition-all duration-300
        ${scrolled ? "py-1 h-[60px]" : "py-3 h-[80px]"}`}
      >
        {/* Logo + Titre */}
        <div className="flex items-center gap-2 pl-5 transition-all duration-300">
          <img
            src={logo}
            alt="Nudify France"
            className={`object-contain transition-all duration-300 ${scrolled ? "w-10" : "w-14"}`}
          />
          <h1
            className={`font-semibold transition-all duration-300 ${
              scrolled ? "text-sm" : "text-base"
            }`}
          >
            Nudify France
          </h1>
        </div>

        {/* Navigation Desktop */}
        <nav
          className={`hidden sm:flex space-x-6 pr-5 font-medium transition-all duration-300 ${
            scrolled ? "text-sm" : "text-[15px]"
          }`}
        >
          <Link to="/" className="hover:text-blue-400 transition-colors relative group">
            Accueil
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-blue-400 transition-all group-hover:w-full"></span>
          </Link>
          <Link to="/tarifs" className="hover:text-blue-400 transition-colors relative group">
            Tarifs
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-blue-400 transition-all group-hover:w-full"></span>
          </Link>
          <Link to="/avant-apres" className="hover:text-blue-400 transition-colors relative group">
            Avant / Après
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-blue-400 transition-all group-hover:w-full"></span>
          </Link>
          <Link to="/support" className="hover:text-blue-400 transition-colors relative group">
            Support
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-blue-400 transition-all group-hover:w-full"></span>
          </Link>
        </nav>

        {/* Bouton Menu Mobile (sans react-icons) */}
        <button
          className="sm:hidden pr-5 text-2xl font-bold focus:outline-none"
          onClick={toggleMenu}
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        {/* 💰 Crédits */}
        <div
          className={`bg-blue-600 hidden sm:block mr-5 rounded-full text-sm font-semibold shadow-md px-4 py-1.5 transition-all duration-300 ${
            scrolled ? "scale-90" : "scale-100"
          }`}
        >
          💰 {credits} crédits
        </div>
      </header>

      {/* MENU MOBILE */}
      {menuOpen && (
        <div className="fixed top-[60px] left-0 w-full bg-[#1E1E2F] border-t border-white/10 flex flex-col items-center space-y-5 py-6 sm:hidden z-40">
          <Link onClick={toggleMenu} to="/" className="text-lg hover:text-blue-400">Accueil</Link>
          <Link onClick={toggleMenu} to="/tarifs" className="text-lg hover:text-blue-400">Tarifs</Link>
          <Link onClick={toggleMenu} to="/avant-apres" className="text-lg hover:text-blue-400">Avant / Après</Link>
          <Link onClick={toggleMenu} to="/support" className="text-lg hover:text-blue-400">Support</Link>
          <div className="bg-blue-600 rounded-full px-5 py-1 text-sm font-semibold shadow-md">
            💰 {credits} crédits
          </div>
        </div>
      )}

      {/* MARGE pour éviter que le contenu soit caché */}
      <div className="h-[80px]" />

      {/* CONTENU */}
      <main className="flex-grow p-6 mt-2">{children}</main>

      {/* FOOTER */}
      <footer className="text-center text-gray-500 py-3 text-xs border-t border-white/10">
        © {new Date().getFullYear()} Nudify France — Tous droits réservés
      </footer>
    </div>
  );
}


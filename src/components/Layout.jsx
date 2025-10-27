import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Layout({ children }) {
  const [credits, setCredits] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const email = "demo@nudify.fr";

  // 🎯 Fetch des crédits
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

  // 🎢 Détection du scroll pour réduire la barre
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) setScrolled(true);
      else setScrolled(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
            className={`object-contain transition-all duration-300 ${
              scrolled ? "w-10" : "w-14"
            }`}
          />
          <h1
            className={`font-semibold transition-all duration-300 ${
              scrolled ? "text-sm" : "text-base"
            }`}
          >
            Nudify France
          </h1>
        </div>

        {/* Navigation */}
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

        {/* Crédits */}
        <div
          className={`bg-blue-600 mr-4 rounded-full text-xs font-semibold shadow-sm px-3 py-1 transition-all duration-300 ${
            scrolled ? "scale-90" : "scale-100"
          }`}
        >
          💰 {credits} crédits
        </div>
      </header>

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


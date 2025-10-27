import React from "react";
import { Link } from "react-router-dom";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[#1E1E2F] text-white flex flex-col font-['Montserrat']">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-[#3A2BE2]">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Nudify France" className="w-10 h-10" />
          <span className="text-xl font-bold">Nudify France</span>
        </Link>
        <nav className="flex gap-6 text-sm">
          <Link to="/tarifs" className="hover:text-[#FF3EA5] transition">
            Tarifs
          </Link>
          <Link to="/avant-apres" className="hover:text-[#FF3EA5] transition">
            Avant / Après
          </Link>
          <Link to="/support" className="hover:text-[#FF3EA5] transition">
            Support
          </Link>
        </nav>
      </header>

      {/* Contenu principal */}
      <main className="flex-1 p-8">{children}</main>

      {/* Footer */}
      <footer className="border-t border-[#3A2BE2] py-4 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Nudify France — Tous droits réservés
      </footer>
    </div>
  );
}

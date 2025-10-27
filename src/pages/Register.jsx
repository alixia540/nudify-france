import React, { useState } from "react";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const API_BASE =
    window.location.hostname === "localhost"
      ? "http://localhost:10000"
      : "https://nudify-backend.onrender.com";

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Compte créé avec succès !");
        window.location.href = "/login";
      } else {
        alert("❌ " + (data.error || "Erreur lors de l'inscription"));
      }
    } catch (err) {
      alert("❌ Erreur réseau : " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#1E1E2F] text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-pink-500 bg-clip-text text-transparent">
        Créer un compte
      </h1>

      <form
        onSubmit={handleRegister}
        className="bg-[#252542] p-8 rounded-2xl shadow-xl w-80 flex flex-col gap-4 border border-white/10"
      >
        <input
          type="email"
          placeholder="Adresse e-mail"
          className="p-3 rounded text-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          className="p-3 rounded text-black"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-blue-500 to-pink-500 py-3 rounded-lg font-semibold hover:opacity-90 transition"
        >
          S'inscrire
        </button>
      </form>

      <p className="mt-4 text-gray-400">
        Déjà un compte ?{" "}
        <a href="/login" className="text-pink-400 hover:underline">
          Se connecter
        </a>
      </p>
    </div>
  );
}

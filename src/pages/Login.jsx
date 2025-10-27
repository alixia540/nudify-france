import React, { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const API_BASE =
    window.location.hostname === "localhost"
      ? "http://localhost:10000"
      : "https://nudify-backend.onrender.com";

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        // ✅ Sauvegarde du token + email
        localStorage.setItem("token", data.token);
        localStorage.setItem("email", email);

        alert("✅ Connexion réussie !");
        window.location.href = "/"; // redirection vers la page d'accueil
      } else {
        alert("❌ " + (data.error || "Identifiants incorrects"));
      }
    } catch (err) {
      alert("❌ Erreur réseau : " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#1E1E2F] text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-pink-500 bg-clip-text text-transparent">
        Connexion
      </h1>

      <form
        onSubmit={handleLogin}
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
          Se connecter
        </button>
      </form>
    </div>
  );
}


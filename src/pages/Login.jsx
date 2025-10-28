import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const API_BASE =
    window.location.hostname === "localhost"
      ? "http://localhost:10000"
      : "https://nudify-backend.onrender.com";

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Erreur inconnue");

      // ✅ Sauvegarde du token et de l'email
      localStorage.setItem("token", data.token);
      localStorage.setItem("email", email);

      navigate("/"); // redirige vers l'accueil
    } catch (err) {
      setError("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#1E1E2F] text-white px-6">
      <div className="bg-[#252542] p-8 rounded-2xl shadow-xl w-full max-w-md border border-white/10">
        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-400 to-pink-500 bg-clip-text text-transparent mb-6">
          Connexion
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Adresse email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 rounded-lg bg-[#1E1E2F] border border-gray-600 focus:border-pink-400 outline-none"
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 rounded-lg bg-[#1E1E2F] border border-gray-600 focus:border-pink-400 outline-none"
          />

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-pink-500 rounded-lg font-semibold hover:scale-105 transition-transform duration-200"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <p className="text-center mt-4 text-gray-400 text-sm">
          Pas encore de compte ?{" "}
          <Link to="/register" className="text-pink-400 hover:underline">
            S’inscrire
          </Link>
        </p>
      </div>
    </div>
  );
}

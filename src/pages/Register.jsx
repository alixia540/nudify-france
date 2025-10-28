import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const API_BASE =
    window.location.hostname === "localhost"
      ? "http://localhost:10000"
      : "https://nudify-backend.onrender.com";

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur inconnue");

      alert("✅ Compte créé avec succès !");
      navigate("/login");
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
          Créer un compte
        </h1>

        <form onSubmit={handleRegister} className="space-y-4">
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
            className="w-full py-3 bg-gradient-to-r from-pink-500 to-blue-500 rounded-lg font-semibold hover:scale-105 transition-transform duration-200"
          >
            {loading ? "Création..." : "S’inscrire"}
          </button>
        </form>

        <p className="text-center mt-4 text-gray-400 text-sm">
          Déjà un compte ?{" "}
          <Link to="/login" className="text-pink-400 hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}

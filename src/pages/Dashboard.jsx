import React, { useEffect, useState } from "react";

export default function Dashboard() {
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(true);
  const email = localStorage.getItem("email");

  const API_BASE =
    window.location.hostname === "localhost"
      ? "http://localhost:10000"
      : "https://nudify-backend.onrender.com";

  useEffect(() => {
    if (!email) return;
    fetch(`${API_BASE}/api/credits/${email}`, {
      headers: { "x-api-key": "NUDIFY_SUPER_SECRET_2025" },
    })
      .then((res) => res.json())
      .then((data) => {
        setCredits(data.credits || 0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [email]);

  const handleGenerate = () => {
    if (credits <= 0) {
      alert("❌ Tu n’as plus de crédits disponibles !");
    } else {
      alert("🪄 Bientôt disponible : génération d’image IA !");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#1E1E2F] text-white px-6 py-16">
      <div className="bg-[#252542] rounded-2xl shadow-lg p-8 md:p-12 max-w-xl w-full text-center border border-white/10">
        <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-pink-500 bg-clip-text text-transparent">
          Mon espace
        </h1>

        {loading ? (
          <p className="text-gray-400">Chargement des informations...</p>
        ) : (
          <>
            <p className="text-gray-300 mb-2">
              Connecté en tant que :{" "}
              <span className="font-semibold text-blue-400">{email}</span>
            </p>

            <div className="bg-blue-600/20 border border-blue-500/40 rounded-xl py-4 px-6 my-6">
              <h2 className="text-2xl font-semibold mb-1">
                💰 {credits} crédits restants
              </h2>
              <p className="text-gray-400 text-sm">
                Utilise-les pour générer tes images IA Nudify.
              </p>
            </div>

            <button
              onClick={handleGenerate}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                credits > 0
                  ? "bg-gradient-to-r from-blue-500 to-pink-500 hover:opacity-90"
                  : "bg-gray-600 cursor-not-allowed"
              }`}
              disabled={credits <= 0}
            >
              🚀 Générer une image
            </button>

            <div className="mt-8 border-t border-gray-700 pt-4 text-sm text-gray-400">
              <p>
                Plus de crédits ?{" "}
                <a
                  href="/tarifs"
                  className="text-pink-400 hover:underline font-semibold"
                >
                  Acheter un pack ici
                </a>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

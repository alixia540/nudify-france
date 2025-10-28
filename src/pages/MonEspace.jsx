import React, { useEffect, useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useNavigate } from "react-router-dom";

export default function MonEspace() {
  const [credits, setCredits] = useState(0);
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const email = localStorage.getItem("email");
  const token = localStorage.getItem("token");

  const API_BASE =
    window.location.hostname === "localhost"
      ? "http://localhost:10000"
      : "https://nudify-backend.onrender.com";

  // 📊 Récupération des crédits
  useEffect(() => {
    if (!email) return;
    fetch(`${API_BASE}/api/credits/${email}`, {
      headers: { "x-api-key": "NUDIFY_SUPER_SECRET_2025" },
    })
      .then((res) => res.json())
      .then((data) => setCredits(data.credits || 0))
      .catch(() => setCredits(0));
  }, [email]);

  // 🧩 Changement du mot de passe
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!newPassword) return alert("Entre un nouveau mot de passe.");

    try {
      const res = await fetch(`${API_BASE}/api/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "NUDIFY_SUPER_SECRET_2025",
        },
        body: JSON.stringify({ email, newPassword }),
      });
      const data = await res.json();

      if (res.ok) {
        alert("✅ Mot de passe modifié avec succès !");
        setNewPassword("");
      } else {
        alert("❌ " + (data.error || "Erreur serveur"));
      }
    } catch {
      alert("❌ Erreur réseau.");
    }
  };

  // 💳 Achat de crédits
  const createOrder = async (amount) => {
    const res = await fetch(`${API_BASE}/api/paypal/create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, amount }),
    });
    const data = await res.json();
    return data.id;
  };

  const captureOrder = async (orderId) => {
    await fetch(`${API_BASE}/api/paypal/capture-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, email }),
    });
    alert("✅ Paiement réussi ! Tes crédits ont été ajoutés.");
    window.location.reload();
  };

  // 🚪 Déconnexion
  const handleLogout = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("token");
    alert("👋 Déconnecté avec succès !");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#1E1E2F] text-white py-16 px-6 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-pink-500 bg-clip-text text-transparent">
        Mon espace personnel
      </h1>

      <div className="bg-[#252542] rounded-2xl p-8 shadow-xl max-w-lg w-full border border-white/10">
        <h2 className="text-xl font-semibold mb-4 text-center">👤 Compte utilisateur</h2>
        <p className="text-gray-300 text-center mb-6">{email}</p>

        <div className="text-center mb-6">
          <p className="text-lg font-semibold mb-2">💰 Solde actuel :</p>
          <p className="text-3xl font-bold text-blue-400">{credits} crédits</p>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3 text-center">Changer mon mot de passe</h3>
          <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
            <input
              type="password"
              placeholder="Nouveau mot de passe"
              className="p-3 rounded-lg bg-[#1E1E2F] border border-gray-700 focus:border-pink-400 outline-none text-white"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-pink-500 py-3 rounded-lg font-semibold hover:opacity-90 transition"
            >
              Mettre à jour
            </button>
          </form>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 text-center">Acheter des crédits</h3>
          <PayPalScriptProvider
            options={{
              "client-id": "AdYF4FyjBUKIR0JZ4buk5NLnICKEI726JnNOr9eHXFAClWbEhe5AKtVnllynoWA2Ib5Jkm6eD5aMEpko",
              currency: "EUR",
            }}
          >
            <div className="flex justify-center">
              <PayPalButtons
                style={{ layout: "vertical", color: "blue", shape: "rect" }}
                createOrder={() => createOrder("5")}
                onApprove={(data) => captureOrder(data.orderID)}
                onError={(err) => alert("❌ Erreur PayPal : " + err.message)}
              />
            </div>
          </PayPalScriptProvider>
        </div>

        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg font-semibold transition"
        >
          Déconnexion
        </button>
      </div>
    </div>
  );
}

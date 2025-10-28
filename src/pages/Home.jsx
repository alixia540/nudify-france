import React from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import logo from "../assets/logo.png";
import avant1 from "../assets/before1.jpeg";
import apres1 from "../assets/after1.jpeg";

export default function Home() {
  const email = localStorage.getItem("email") || "demo@nudify.fr";

  const API_BASE =
    window.location.hostname === "localhost"
      ? "http://localhost:10000"
      : "https://nudify-backend.onrender.com";

  return (
    <div className="min-h-screen bg-[#1E1E2F] text-white flex flex-col items-center justify-center px-6 pt-6 md:pt-16 pb-16">
      {/* 🌸 Logo */}
      <img
        src={logo}
        alt="Nudify France Logo"
        className="w-48 h-48 mb-10 select-none"
      />

      {/* 🏠 Titre principal */}
      <h1 className="text-5xl md:text-6xl font-extrabold text-center mb-6">
        <span className="text-white">Bienvenue sur </span>
        <span className="bg-gradient-to-r from-blue-400 to-pink-500 bg-clip-text text-transparent">
          Nudify France
        </span>
      </h1>

      <p className="text-center text-gray-300 max-w-2xl mb-12">
        Transforme tes photos en œuvres uniques grâce à l’IA la plus avancée.  
        Recharge tes crédits pour commencer à créer dès maintenant.
      </p>

      {/* 💳 Bouton PayPal */}
      <PayPalScriptProvider
        options={{
          "client-id":
            "AdYF4FyjBUKIR0JZ4buk5NLnICKEI726JnNOr9eHXFAClWbEhe5AKtVnllynoWA2Ib5Jkm6eD5aMEpko",
          currency: "EUR",
        }}
      >
        <div className="mb-20">
          <PayPalButtons
            style={{ layout: "vertical", color: "blue", shape: "rect" }}
            createOrder={async () => {
              const res = await fetch(`${API_BASE}/api/paypal/create-order`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
              });
              const data = await res.json();
              return data.id;
            }}
            onApprove={async (data) => {
              await fetch(`${API_BASE}/api/paypal/capture-order`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId: data.orderID, email }),
              });
              alert("✅ Paiement réussi ! Tes crédits ont été ajoutés.");
              window.location.reload();
            }}
            onError={(err) => alert("❌ Erreur PayPal : " + err.message)}
          />
        </div>
      </PayPalScriptProvider>

      {/* --- 🖼️ Avant / Après Aperçu --- */}
      <div className="mt-8 text-center">
        <h2 className="text-3xl font-bold mb-10">
          <span className="text-white">Exemple </span>
          <span className="bg-gradient-to-r from-blue-400 to-pink-500 bg-clip-text text-transparent">
            Avant / Après
          </span>
        </h2>

        <div className="flex flex-col md:flex-row justify-center items-center gap-10">
          {/* Bloc Avant */}
          <div className="relative group">
            <img
              src={avant1}
              alt="Avant"
              className="w-72 md:w-80 rounded-2xl shadow-2xl transform transition duration-500 group-hover:scale-105 group-hover:opacity-90"
            />
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 px-4 py-1 rounded-full text-sm font-semibold text-white tracking-wide">
              AVANT
            </div>
          </div>

          {/* Bloc Après */}
          <div className="relative group">
            <img
              src={apres1}
              alt="Après"
              className="w-72 md:w-80 rounded-2xl shadow-2xl transform transition duration-500 group-hover:scale-105 group-hover:opacity-90"
            />
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-pink-500 px-4 py-1 rounded-full text-sm font-semibold text-white tracking-wide">
              APRÈS
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}




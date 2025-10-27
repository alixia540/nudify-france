import React from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import logo from "../assets/logo.png"; // 👈 assure-toi que ton logo est bien ici

export default function Home() {
  const email = "demo@nudify.fr";

  const API_BASE =
    window.location.hostname === "localhost"
      ? "http://localhost:10000"
      : "https://nudify-backend.onrender.com";

  const createOrder = async () => {
    const res = await fetch(`${API_BASE}/api/paypal/create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: "1.00" }),
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
    alert("✅ Paiement réussi !");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#1E1E2F] text-white text-center px-4">
      {/* Logo */}
      <img
        src={logo}
        alt="Nudify France Logo"
        className="w-40 sm:w-48 md:w-56 mb-6 animate-fadeIn"
      />

      {/* Titre principal avec dégradé */}
      <h1 className="text-4xl md:text-5xl font-bold mb-4">
        Bienvenue sur{" "}
        <span className="bg-gradient-to-r from-blue-400 to-pink-500 bg-clip-text text-transparent">
          Nudify France
        </span>
      </h1>

      <p className="text-gray-400 mb-10 max-w-xl">
        Transforme tes photos grâce à l’IA la plus avancée.  
      </p>

      {/* Bouton PayPal */}
      <PayPalScriptProvider
        options={{
          "client-id": "AdYF4FyjBUKIR0JZ4buk5NLnICKEI726JnNOr9eHXFAClWbEhe5AKtVnllynoWA2Ib5Jkm6eD5aMEpko",
          currency: "EUR",
        }}
      >
        <PayPalButtons
          style={{ layout: "vertical", color: "blue", shape: "rect" }}
          createOrder={() => createOrder()}
          onApprove={(data) => captureOrder(data.orderID)}
          onError={(err) => alert("❌ Erreur PayPal : " + err.message)}
        />
      </PayPalScriptProvider>
    </div>
  );
}



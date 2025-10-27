import React from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import logo from "../assets/logo.png";

export default function Home() {
  const email = "demo@nudify.fr";

  return (
    <div className="min-h-screen bg-[#1E1E2F] text-white flex flex-col items-center justify-center text-center space-y-8">
      <img src={logo} alt="Nudify France" className="w-32 mb-6 opacity-90" />

      <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-pink-500 bg-clip-text text-transparent drop-shadow-lg">
        Nudifiez vos photos en un clic
      </h1>

      <p className="max-w-xl text-gray-300 text-lg">
        Nudify France transforme vos clichés avec une IA de précision.
        Achetez vos crédits et générez vos images dès maintenant.
      </p>

      <div className="bg-white/10 p-6 rounded-2xl shadow-lg backdrop-blur-lg w-80">
        <h2 className="text-xl mb-3 font-semibold">Acheter des crédits</h2>

        <PayPalScriptProvider
          options={{
            "client-id": "AdYF4FyjBUKIR0JZ4buk5NLnICKEI726JnNOr9eHXFAClWbEhe5AKtVnllynoWA2Ib5Jkm6eD5aMEpko",
            currency: "EUR",
          }}
        ><PayPalButtons
  style={{ layout: "vertical", color: "blue", shape: "rect" }}
  createOrder={async () => {
    // 🔁 Choix automatique entre local et production
    const API_BASE =
      window.location.hostname === "localhost"
        ? "http://localhost:10000"
        : "https://nudify-backend.onrender.com";

    const res = await fetch(`${API_BASE}/api/paypal/create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: "1.00" }), // ✅ on envoie le montant attendu
    });

    const data = await res.json();
    console.log("✅ Réponse création commande :", data);
    return data.id;
  }}
  onApprove={async (data) => {
    // 🔁 Même logique pour la capture
    const API_BASE =
      window.location.hostname === "localhost"
        ? "http://localhost:10000"
        : "https://nudify-backend.onrender.com";

    const captureRes = await fetch(`${API_BASE}/api/paypal/capture-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: data.orderID }),
    });

    const captureData = await captureRes.json();
    console.log("✅ Commande capturée :", captureData);
  }}
/>

        </PayPalScriptProvider>
      </div>
    </div>
  );
}


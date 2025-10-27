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
        >
          <PayPalButtons
            style={{ layout: "vertical", color: "blue", shape: "rect" }}
            createOrder={async () => {
              const res = await fetch("https://nudify-backend.onrender.com/api/paypal/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
              });
              const data = await res.json();
              return data.id;
            }}
            onApprove={async (data) => {
              await fetch("https://nudify-backend.onrender.com/api/paypal/capture-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId: data.orderID, email }),
              });
              alert("✅ Paiement réussi ! Tes crédits ont été ajoutés.");
              window.location.reload();
            }}
            onError={(err) => alert("❌ Erreur PayPal : " + err.message)}
          />
        </PayPalScriptProvider>
      </div>
    </div>
  );
}


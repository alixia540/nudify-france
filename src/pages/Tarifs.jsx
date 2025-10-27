import React from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export default function Tarifs() {
  const email = "demo@nudify.fr";

  const API_BASE =
    window.location.hostname === "localhost"
      ? "http://localhost:10000"
      : "https://nudify-backend.onrender.com";

  const tarifs = [
    {
      title: "Photo unique",
      desc: "1 crédit par génération IA",
      price: "1 €",
      amount: "1.00",
      gradient: "from-blue-400 to-pink-500",
    },
    {
      title: "Pass VIP",
      desc: "20 images générées - accès prioritaire",
      price: "15 €",
      amount: "15.00",
      gradient: "from-pink-400 to-purple-500",
    },
    {
      title: "Pass PREMIUM",
      desc: "50 images + support premium",
      price: "30 €",
      amount: "30.00",
      gradient: "from-blue-500 to-cyan-400",
    },
  ];

  const createOrder = async (amount) => {
    const res = await fetch(`${API_BASE}/api/paypal/create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
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

  return (
    <div className="min-h-screen bg-[#1E1E2F] text-white flex flex-col items-center py-16 px-6">
      <h1 className="text-4xl font-bold mb-10 bg-gradient-to-r from-blue-400 to-pink-500 bg-clip-text text-transparent text-center">
        Nos Tarifs
      </h1>

      <PayPalScriptProvider
        options={{
          "client-id": "AdYF4FyjBUKIR0JZ4buk5NLnICKEI726JnNOr9eHXFAClWbEhe5AKtVnllynoWA2Ib5Jkm6eD5aMEpko",
          currency: "EUR",
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {tarifs.map((pack, i) => (
            <div
              key={i}
              className="bg-[#252542] rounded-2xl p-8 shadow-lg border border-white/10 flex flex-col items-center hover:scale-105 transition-all duration-300"
            >
              <h2
                className={`text-2xl font-bold mb-3 bg-gradient-to-r ${pack.gradient} bg-clip-text text-transparent`}
              >
                {pack.title}
              </h2>
              <p className="text-gray-400 mb-4">{pack.desc}</p>
              <p className="text-4xl font-extrabold mb-4">{pack.price}</p>

              <PayPalButtons
                style={{ layout: "vertical", color: "blue", shape: "rect" }}
                createOrder={() => createOrder(pack.amount)}
                onApprove={(data) => captureOrder(data.orderID)}
                onError={(err) =>
                  alert("❌ Erreur PayPal : " + err.message)
                }
              />
            </div>
          ))}
        </div>
      </PayPalScriptProvider>
    </div>
  );
}

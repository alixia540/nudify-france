import React from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export default function Tarifs() {
  const email = "demo@nudify.fr"; // tu pourras le remplacer plus tard par l'utilisateur connecté

  const tarifs = [
    {
      id: "basic",
      title: "Photo unique",
      description: "1 crédit par génération IA",
      color: "from-blue-400 to-pink-500",
      price: "1 €",
      value: "1",
      benefits: ["1 image générée", "Résultat HD", "Livraison instantanée"],
    },
    {
      id: "vip",
      title: "Pass VIP",
      description: "Accès prioritaire + génération rapide",
      color: "from-pink-400 to-purple-500",
      price: "15 €",
      value: "15",
      benefits: [
        "20 images générées",
        "Accès prioritaire",
        "Support dédié",
      ],
    },
    {
      id: "premium",
      title: "Pass PREMIUM",
      description: "Support prioritaire + bonus crédits",
      color: "from-blue-500 to-cyan-400",
      price: "30 €",
      value: "30",
      benefits: [
        "50 images générées",
        "Support premium",
        "Bonus crédits offerts",
      ],
    },
  ];

  const createOrder = async (amount) => {
    const res = await fetch("https://nudify-backend.onrender.com/api/paypal/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, amount }),
    });
    const data = await res.json();
    return data.id;
  };

  const captureOrder = async (orderId) => {
    await fetch("https://nudify-backend.onrender.com/api/paypal/capture-order", {
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

      <p className="text-gray-300 text-center mb-12 max-w-2xl">
        Choisis le pack adapté à ton usage.  
        Chaque crédit te permet de générer une photo IA de haute qualité.
      </p>

      <PayPalScriptProvider
        options={{
          "client-id": "AdYF4FyjBUKIR0JZ4buk5NLnICKEI726JnNOr9eHXFAClWbEhe5AKtVnllynoWA2Ib5Jkm6eD5aMEpko",
          currency: "EUR",
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {tarifs.map((item, i) => (
            <div
              key={i}
              className="bg-[#252542] rounded-2xl p-8 shadow-xl border border-white/10 hover:scale-105 hover:border-pink-400/40 transition-all duration-300 flex flex-col items-center"
            >
              <h2
                className={`text-2xl font-bold mb-3 bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}
              >
                {item.title}
              </h2>
              <p className="text-gray-400 mb-6">{item.description}</p>

              <p className="text-4xl font-extrabold mb-4">{item.price}</p>

              <ul className="text-gray-300 text-sm mb-6 space-y-2">
                {item.benefits.map((b, j) => (
                  <li key={j}>✅ {b}</li>
                ))}
              </ul>

              <div className="w-full mt-auto">
                <PayPalButtons
                  style={{ layout: "vertical", color: "blue", shape: "rect" }}
                  createOrder={() => createOrder(item.value)}
                  onApprove={(data) => captureOrder(data.orderID)}
                  onError={(err) => alert("❌ Erreur PayPal : " + err.message)}
                />
              </div>
            </div>
          ))}
        </div>
      </PayPalScriptProvider>
    </div>
  );
}


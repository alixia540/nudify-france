import React from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export default function Home() {
  const email = "demo@nudify.fr"; // plus tard : email utilisateur connecté

  return (
    <div className="text-center space-y-6">
      <h1 className="text-3xl font-bold">Acheter des crédits</h1>
      <p className="text-gray-400 max-w-xl mx-auto">
        Choisis ton pack pour obtenir des crédits et générer tes photos Nudify.
      </p>

      {/* === Bouton PayPal === */}
      <PayPalScriptProvider
        options={{
          "client-id": "AdYF4FyjBUKIR0JZ4buk5NLnICKEI726JnNOr9eHXFAClWbEhe5AKtVnllynoWA2Ib5Jkm6eD5aMEpko", // ⚠️ à remplacer
            currency: "EUR",
        }}
      >
        <PayPalButtons
          style={{
            layout: "vertical",
            color: "blue",
            shape: "rect",
            label: "paypal",
          }}
          createOrder={async () => {
            const res = await fetch("http://localhost:4242/api/paypal/create-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email }),
            });
            const data = await res.json();
            return data.id;
          }}
          onApprove={async (data) => {
            await fetch("http://localhost:4242/api/paypal/capture-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ orderId: data.orderID, email }),
            });
            alert("✅ Paiement réussi ! Tes crédits ont été ajoutés.");
            window.location.reload();
          }}
          onError={(err) => alert("❌ Erreur PayPal : " + err)}
        />
      </PayPalScriptProvider>
    </div>
  );
}

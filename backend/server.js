// ======== server.js ========
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";
import User from "./userModel.js"; // ton modèle utilisateur

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ===============================
// 🔗 Connexion MongoDB
// ===============================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connecté à MongoDB"))
  .catch((err) => console.error("❌ Erreur MongoDB :", err));

// ===============================
// 💰 PayPal Configuration
// ===============================
const PAYPAL_API = "https://api-m.sandbox.paypal.com"; // toujours sandbox pour les tests
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET;

// ===============================
// 📩 Routes pour gérer les crédits
// ===============================

// ➕ Récupérer les crédits d’un utilisateur
app.get("/api/credits/:email", async (req, res) => {
  const { email } = req.params;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.json({ credits: 0 });
    res.json({ credits: user.credits });
  } catch (err) {
    console.error("Erreur récupération crédits :", err);
    res.status(500).json({ error: "Erreur récupération crédits" });
  }
});

// ===============================
// 💳 Routes PayPal
// ===============================

// 🧾 Création de commande PayPal
app.post("/api/paypal/create-order", async (req, res) => {
  try {
    const response = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Basic " + Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString("base64"),
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "EUR",
              value: req.body.amount, // montant envoyé par le frontend
            },
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Erreur API PayPal:", data);
      return res.status(500).json({ error: "Erreur API PayPal", details: data });
    }

    console.log("✅ Commande PayPal créée :", data.id);
    res.json(data);
  } catch (err) {
    console.error("Erreur création commande PayPal:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// 💰 Capture du paiement PayPal et ajout de crédits
app.post("/api/paypal/capture-order/:orderID", async (req, res) => {
  const { orderID } = req.params;
  const { email } = req.body;

  try {
    const response = await fetch(`${PAYPAL_API}/v2/checkout/orders/${orderID}/capture`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Basic " + Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString("base64"),
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Erreur capture PayPal:", data);
      return res.status(500).json({ error: "Erreur capture PayPal", details: data });
    }

    // ✅ Créditer l’utilisateur après paiement
    const user = await User.findOneAndUpdate(
      { email },
      { $inc: { credits: 10 } }, // ajoute 10 crédits par exemple
      { new: true, upsert: true }
    );

    console.log(`✅ Paiement capturé pour ${email} — crédits: ${user.credits}`);
    res.json({ success: true, order: data, credits: user.credits });
  } catch (err) {
    console.error("Erreur capture PayPal:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ===============================
// 🚀 Démarrage du serveur
// ===============================
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Serveur actif sur le port ${PORT}`));


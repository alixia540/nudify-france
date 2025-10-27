import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({ origin: [process.env.FRONTEND_URL, "http://localhost:5173", "http://localhost:3000"] }));

// --- Connexion MongoDB ---
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connecté à MongoDB"))
  .catch(err => console.error("❌ Erreur MongoDB :", err));

// --- Modèle utilisateur ---
const userSchema = new mongoose.Schema({
  email: String,
  credits: { type: Number, default: 0 },
});
const User = mongoose.model("User", userSchema);

// --- Route: récupérer crédits ---
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

// --- Route: créer une commande PayPal ---
app.post("/api/paypal/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    // Authentification PayPal
    const auth = await fetch("https://api-m.sandbox.paypal.com/v1/oauth2/token", {
      method: "POST",
      headers: {
        Authorization: "Basic " + Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    const tokenData = await auth.json();
    if (!tokenData.access_token) {
      console.error("⚠️ Erreur token PayPal :", tokenData);
      return res.status(400).json({ error: "Erreur token PayPal", details: tokenData });
    }

    // Création commande
    const order = await fetch("https://api-m.sandbox.paypal.com/v2/checkout/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenData.access_token}`,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [{ amount: { currency_code: "EUR", value: amount } }],
      }),
    });

    const orderData = await order.json();
    if (!orderData.id) {
      console.error("⚠️ Erreur création commande PayPal :", orderData);
      return res.status(400).json({ error: "Erreur création commande PayPal", details: orderData });
    }

    res.json({ id: orderData.id });
  } catch (err) {
    console.error("❌ Erreur serveur PayPal :", err);
    res.status(500).json({ error: "Erreur serveur PayPal" });
  }
});

// --- Route: capturer une commande PayPal ---
app.post("/api/paypal/capture-order", async (req, res) => {
  try {
    const { orderId, email } = req.body;

    const auth = await fetch("https://api-m.sandbox.paypal.com/v1/oauth2/token", {
      method: "POST",
      headers: {
        Authorization: "Basic " + Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });
    const tokenData = await auth.json();

    const capture = await fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const captureData = await capture.json();
    if (!captureData.status || captureData.status !== "COMPLETED") {
      console.error("⚠️ Erreur capture PayPal :", captureData);
      return res.status(400).json({ error: "Erreur capture PayPal", details: captureData });
    }

    // Crédits utilisateur
    const user = await User.findOneAndUpdate(
      { email },
      { $inc: { credits: 1 } },
      { upsert: true, new: true }
    );

    res.json({ success: true, user });
  } catch (err) {
    console.error("❌ Erreur capture PayPal :", err);
    res.status(500).json({ error: "Erreur serveur capture" });
  }
});

// --- Lancement ---
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Serveur actif sur le port ${PORT} (mode sandbox)`));


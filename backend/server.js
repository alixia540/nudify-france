import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import paypal from "@paypal/checkout-server-sdk";

dotenv.config();

const app = express();
app.use(express.json());

// Autoriser ton front Vercel
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
  })
);

// ✅ Connexion MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connecté à MongoDB"))
  .catch((err) => console.error("❌ Erreur MongoDB :", err));

// === CONFIG PAYPAL ===
let environment;
try {
  if (process.env.PAYPAL_MODE === "sandbox") {
    environment = new paypal.core.SandboxEnvironment(
      process.env.PAYPAL_CLIENT_ID,
      process.env.PAYPAL_SECRET
    );
  } else {
    environment = new paypal.core.LiveEnvironment(
      process.env.PAYPAL_CLIENT_ID,
      process.env.PAYPAL_SECRET
    );
  }
} catch (err) {
  console.error("❌ Erreur initialisation PayPal :", err);
}

const client = new paypal.core.PayPalHttpClient(environment);

// === ROUTE TEST ===
app.get("/", (req, res) => {
  res.send("✅ Backend Nudify France opérationnel !");
});

// === ROUTE CREATION COMMANDE PAYPAL ===
app.post("/api/paypal/create-order", async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount) return res.status(400).json({ error: "Montant manquant" });

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "EUR",
            value: amount,
          },
        },
      ],
    });

    const order = await client.execute(request);
    console.log("✅ Commande PayPal créée :", order.result.id);
    res.json({ id: order.result.id });
  } catch (err) {
    console.error("❌ Erreur création commande PayPal :", err.message);
    if (err.response) {
      console.error("🧾 Réponse PayPal :", err.response);
      return res.status(err.statusCode || 500).json(err.response);
    }
    res.status(500).json({ error: "Erreur création commande PayPal" });
  }
});

// === ROUTE CREDITS UTILISATEUR ===
app.get("/api/credits/:email", async (req, res) => {
  const { email } = req.params;
  try {
    const user = await mongoose.connection
      .collection("users")
      .findOne({ email });
    if (!user) return res.json({ credits: 0 });
    res.json({ credits: user.credits });
  } catch (err) {
    console.error("Erreur récupération crédits :", err);
    res.status(500).json({ error: "Erreur récupération crédits" });
  }
});

// === LANCEMENT DU SERVEUR ===
const PORT = process.env.PORT || 10000;
app.listen(PORT, () =>
  console.log(`🚀 Serveur actif sur le port ${PORT} (mode ${process.env.PAYPAL_MODE})`)
);


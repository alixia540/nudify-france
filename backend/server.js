import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import paypal from "@paypal/checkout-server-sdk";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

// 🧩 MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("connected", () =>
  console.log("✅ Connecté à MongoDB avec succès")
);

// 🧾 Schéma utilisateur
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  credits: { type: Number, default: 0 },
});
const User = mongoose.model("User", userSchema);

// ⚙️ Config PayPal
const Environment = paypal.core.SandboxEnvironment;
const client = new paypal.core.PayPalHttpClient(
  new Environment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_SECRET
  )
);

// 🔹 Créer une commande PayPal
app.post("/api/paypal/create-order", async (req, res) => {
  const { amount } = req.body;
  const request = new paypal.orders.OrdersCreateRequest();
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [{ amount: { currency_code: "EUR", value: amount } }],
  });

  const order = await client.execute(request);
  res.json({ id: order.result.id });
});

// 🔹 Capturer une commande et ajouter les crédits
app.post("/api/paypal/capture-order", async (req, res) => {
  const { orderId, email } = req.body;
  const request = new paypal.orders.OrdersCaptureRequest(orderId);
  request.requestBody({});
  const capture = await client.execute(request);

  const amount = parseFloat(
    capture.result.purchase_units[0].payments.captures[0].amount.value
  );

  // 🎯 Attribution automatique selon ton barème
  let credits = 0;
  if (amount === 1.0) credits = 1;
  else if (amount === 15.0) credits = 20;
  else if (amount === 30.0) credits = 50;

  // 📊 Mise à jour dans MongoDB
  const user = await User.findOneAndUpdate(
    { email },
    { $inc: { credits: credits } },
    { new: true, upsert: true }
  );

  res.json({ success: true, newCredits: user.credits });
});

// 🔹 Récupérer les crédits actuels
app.get("/api/credits/:email", async (req, res) => {
  const { email } = req.params;
  const user = await User.findOne({ email });
  res.json({ credits: user ? user.credits : 0 });
});

// 🟢 Serveur actif
app.listen(3001, () => console.log("🚀 Serveur backend actif sur le port 3001"));

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// 🔑 Vérification de la clé API (MAJ)
app.use((req, res, next) => {
  const openPaths = ["/api/login", "/api/register", "/api/paypal"];
  const isOpen = openPaths.some((p) => req.path.startsWith(p));

  if (isOpen) return next(); // on laisse passer login/register/paypal

  const key = req.headers["x-api-key"];
  if (key === process.env.API_SECRET_KEY) return next();

  return res.status(403).json({ error: "Accès refusé : clé API invalide" });
});


// 💾 Connexion MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connecté à MongoDB"))
  .catch((err) => console.error("❌ Erreur MongoDB :", err));

// 🧠 Schéma utilisateur
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  credits: { type: Number, default: 0 },
});
const User = mongoose.model("User", userSchema);

// 🧩 Route : inscription
app.post("/api/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "Champs manquants" });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ error: "Email déjà utilisé" });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashed });
    await user.save();

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ message: "Compte créé avec succès", token });
  } catch (err) {
    console.error("Erreur register:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// 🧩 Route : connexion
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Utilisateur introuvable" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: "Mot de passe incorrect" });

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ message: "Connexion réussie", token });
  } catch (err) {
    console.error("Erreur login:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// 🧩 Route : obtenir les crédits
app.get("/api/credits/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.json({ credits: 0 });
    res.json({ credits: user.credits });
  } catch (err) {
    console.error("Erreur crédits:", err);
    res.status(500).json({ error: "Erreur récupération crédits" });
  }
});

// 🧩 Démarrage
const PORT = process.env.PORT || 10000;
app.listen(PORT, () =>
  console.log(`🚀 Serveur actif sur le port ${PORT} (sécurisé, sandbox)`)
);

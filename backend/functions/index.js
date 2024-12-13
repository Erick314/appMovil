const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const firebaseAdmin = require("firebase-admin");
const serviceAccount = require("./credentials/serviceAccountKey.json");

// Inicializa Firebase Admin con las credenciales específicas
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  databaseURL: "https://<your-database-name>.firebaseio.com", // Reemplaza con el URL de tu base de datos
});

// Configuración del servidor Express
const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Middleware de autenticación (Deshabilitado para ciertos endpoints)
const authMiddleware = async (req, res, next) => {
  try {
    next(); // No verificamos tokens en este momento
  } catch (error) {
    res.status(500).json({ error: "Error en el middleware de autenticación" });
  }
};

// Endpoint para obtener empresas (Sin verificación de token)
app.get("/api/getEmpresa", async (req, res) => {
  try {
    const db = firebaseAdmin.firestore();
    console.log("Conectando a Firestore...");
    const snapshot = await db.collection("empresas").get();
    console.log("Documentos obtenidos:", snapshot.size);
    const data = snapshot.docs.map((doc) => doc.data());
    res.status(200).json(data);
  } catch (error) {
    console.error("Error al obtener empresas:", error.message);
    res.status(500).json({ error: "Error al obtener empresas" });
  }
});

// Endpoint para obtener sucursales (Sin verificación de token)
app.get("/api/getSucursal", async (req, res) => {
  try {
    const snapshot = await firebaseAdmin.firestore().collection("sucursales").get();
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(data);
  } catch (error) {
    console.error("Error al obtener sucursales:", error.message);
    res.status(500).json({ error: "Error al obtener sucursales" });
  }
});

// Endpoint para obtener encuestas (Con verificación de token)
app.get("/api/getEncuesta", authMiddleware, async (req, res) => {
  try {
    const snapshot = await firebaseAdmin.firestore().collection("encuestas").get();
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(data);
  } catch (error) {
    console.error("Error al obtener encuestas:", error.message);
    res.status(500).json({ error: "Error al obtener encuestas" });
  }
});

// Exporta la app como función de Firebase
exports.api = functions.https.onRequest(app);

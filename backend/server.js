const express = require("express");
const path = require("path");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const config = require("./src/config");
const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/authRoutes");
const catalogRoutes = require("./src/routes/catalogRoutes");
const clientRoutes = require("./src/routes/clientRoutes");
const assetRoutes = require("./src/routes/assetRoutes");
const contractRoutes = require("./src/routes/contractRoutes");
const userRoutes = require("./src/routes/userRoutes");

// Conectar a la base de datos
connectDB();

const app = express();

// --- MIDDLEWARES GLOBALES DE SEGURIDAD ---
// --- MIDDLEWARES GLOBALES DE SEGURIDAD ---

if (config.isProduction || config.isStaging) {
  // Configuración ESTRICTA para Staging y Producción
  app.use(helmet());
} else {
  // Configuración RELAJADA para Desarrollo (Laptop Ubuntu)
  // Permite cargar recursos locales y evita bloqueos de CSP en el navegador
  app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  );
}

app.use(cors());
app.use(morgan(config.logging.level));
app.use(express.json());

// --- RUTAS DE LA API ---
app.get("/api/status", (req, res) => {
  res.json({
    status: "v1.0.0",
    env: config.env,
    module: "Administrative",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/catalogs", catalogRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/contracts", contractRoutes);
app.use("/api/users", userRoutes);

// --- SERVIDO DE ARCHIVOS ESTÁTICOS Y SPA ---
if (config.env === "development") {
  const frontendPath = path.join(__dirname, "../frontend/dist");

  // 1. Servir archivos estáticos (js, css, imágenes)
  app.use(express.static(frontendPath));

  // 2. Capturar cualquier otra ruta que NO empiece por /api
  // Usamos una expresión regular compatible con Express 5/Node 23
  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

// Manejo de errores global (opcional pero recomendado por seguridad)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: "Algo salió mal en el servidor" });
});

const PORT = config.server.port;
app.listen(PORT, () => {
  console.log(
    `🚀 Servidor corriendo en el puerto ${PORT} en modo ${config.env}`,
  );
});

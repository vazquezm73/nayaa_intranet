const cron = require("node-cron");
const nodemailer = require("nodemailer");
const TelegramBot = require("node-telegram-bot-api");
const Asset = require("../models/Asset");

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN);
const chatId = process.env.TELEGRAM_CHAT_ID;

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ... (tus imports y config de transporter/bot igual)

const checkExpirations = async () => {
  try {
    const assets = await Asset.find({ active: true }).populate("proveedor");

    // 1. "Hoy" en tiempo local a medianoche
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    for (const asset of assets) {
      if (asset.proveedor?.nombre?.toUpperCase().includes("CONTABO")) {
        if (!asset.fechaVencimiento) continue;

        // 2. Extraemos los valores UTC directamente de la DB
        const fechaDB = new Date(asset.fechaVencimiento);

        // 3. NORMALIZACIÓN MAESTRA:
        // Usamos getUTC... para que si en la DB dice "17", extraiga "17"
        // sin importar la zona horaria del servidor.
        const vtoNormalizado = new Date(
          fechaDB.getUTCFullYear(),
          fechaDB.getUTCMonth(),
          fechaDB.getUTCDate(),
          0,
          0,
          0,
          0, // Forzamos medianoche
        );

        const diffTime = vtoNormalizado - hoy;
        const daysLeft = Math.round(diffTime / (1000 * 60 * 60 * 24));

        console.log(
          `Asset: ${asset.nombre} | Vence: ${vtoNormalizado.toLocaleDateString("es-MX")} | Días: ${daysLeft}`,
        );

        // 4. Lógica Inclusiva: 7, 3 y 0 (o menores si ya venció)
        if ([7, 3].includes(daysLeft) || daysLeft <= 0) {
          const statusPrefix =
            daysLeft < 0
              ? `🚨 VENCIDO (${Math.abs(daysLeft)}d)`
              : daysLeft === 0
                ? "🚨 VENCE HOY"
                : `⚠️ VENCE EN ${daysLeft} DÍAS`;

          const text = `${statusPrefix}\nServidor: ${asset.nombre}\nIP: ${asset.ipPrincipal}\nVencimiento: ${vtoNormalizado.toLocaleDateString("es-MX")}`;

          // Enviar Telegram
          bot
            .sendMessage(chatId, text)
            .catch((e) => console.error("Error Telegram:", e.message));

          // Enviar Email
          await transporter
            .sendMail({
              from: `"Nayaa Intranet" <${process.env.EMAIL_USER}>`,
              to: process.env.EMAIL_ADMIN_RECEIVER || process.env.EMAIL_USER,
              subject: `${statusPrefix}: ${asset.nombre}`,
              text: text,
            })
            .catch((e) => console.error("Error Email:", e.message));

          console.log(`🚀 ¡ALERTA ENVIADA para ${asset.nombre}!`);
        }
      }
    }
  } catch (error) {
    console.error("Error en sistema de alertas:", error);
  }
};

// Programar revisión diaria a las 09:00 AM
cron.schedule("0 9 * * *", checkExpirations, {
  timezone: "America/Mexico_City",
});

module.exports = { checkExpirations };

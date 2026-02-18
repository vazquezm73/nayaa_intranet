const mongoose = require("mongoose");
const { encrypt, decrypt } = require("../utils/cryptoUtils");

const serverAccessInfoSchema = new mongoose.Schema(
  {
    asset: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Asset",
      required: true,
      unique: true,
    },

    sshInfo: {
      usuario: { type: String, default: "root" },
      password: { type: String, set: encrypt, get: decrypt }, // <--- Magia aquí
      puerto: { type: Number, default: 2232 },
    },

    serviciosAdicionales: [
      {
        etiqueta: { type: String, required: true },
        url_host: { type: String },
        usuario: { type: String },
        password: { type: String, set: encrypt, get: decrypt }, // <--- Magia aquí
        puerto: { type: String },
        notas: { type: String },
      },
    ],

    notasGenerales: { type: String },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
    toJSON: { getters: true }, // Obligatorio para que el "get" funcione al enviar JSON al frontend
    toObject: { getters: true },
  },
);

module.exports = mongoose.model("ServerAccessInfo", serverAccessInfoSchema);

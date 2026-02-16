const mongoose = require("mongoose");

const ClientSchema = new mongoose.Schema(
  {
    nombreComercial: {
      type: String,
      required: [true, "El nombre comercial es obligatorio"],
      trim: true,
      index: true,
    },
    razonSocial: {
      type: String,
      trim: true,
    },
    rfcTaxId: {
      type: String,
      trim: true,
      uppercase: true,
    },

    // LIGADO A CATÁLOGO (ej: VIP, Gobierno, Regular)
    tipoCliente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Catalog",
      required: [true, "El tipo de cliente debe ser un ID de catálogo válido"],
    },

    // INFORMACIÓN DE CONTACTO
    contactoNombre: {
      type: String,
      required: [true, "El nombre de contacto es obligatorio"],
    },
    email: {
      type: String,
      required: [true, "El email es obligatorio"],
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Por favor ingrese un email válido",
      ],
    },
    telefono: String,

    // UBICACIÓN
    direccion: {
      calle: String,
      ciudad: String,
      estado: String,
      pais: { type: String, default: "México" },
    },

    active: {
      type: Boolean,
      default: true,
    },
    observaciones: String,

    // Auditoría
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true, // Crea automáticamente createdAt y updatedAt
  },
);

module.exports = mongoose.model("Client", ClientSchema);

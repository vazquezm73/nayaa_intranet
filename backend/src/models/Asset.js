const mongoose = require("mongoose");

const AssetSchema = new mongoose.Schema(
  {
    // --- VINCULACIÓN COMERCIAL ---
    nombre: {
      type: String,
      required: [true, "El nombre identificador del activo es obligatorio"],
      trim: true,
    },
    clientes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Client",
      },
    ],
    // --- CLASIFICACIÓN (CATÁLOGOS) ---
    tipoAsset: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Catalog",
      required: [true, "El tipo de activo es obligatorio"],
    }, // Ej: Servidor Dedicado, Hosting, VPS

    status: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Catalog",
      required: [true, "El estado del activo es obligatorio"],
    }, // Ej: Operativo, Suspendido, En Mantenimiento

    // --- DATOS TÉCNICOS ---
    ipPrincipal: {
      type: String,
      trim: true,
    },
    hostname: {
      type: String,
      trim: true,
    },
    proveedor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Catalog",
    }, // Ej: AWS, Google Cloud, Local (Referencia a catálogo tipo 'proveedor')

    // Especificaciones de Hardware/Software
    recursos: {
      cpu: { type: String, default: "N/A" },
      ram: { type: String, default: "N/A" },
      disco: { type: String, default: "N/A" },
      ubicacion: { type: String, default: "N/A" },
      os: { type: String, default: "N/A" },
      ipv6: { type: String, default: "N/A" },
    },

    // --- DATOS FINANCIEROS Y CONTROL ---
    esCompartido: {
      type: Boolean,
      default: false,
    },
    costoMensual: {
      type: Number,
      default: 0,
    },
    costoAnual: {
      type: Number,
      default: 0,
    },
    moneda: {
      type: String,
      default: "MXN",
    },
    fechaVencimiento: {
      type: Date,
    },
    active: {
      type: Boolean,
      default: true,
    },
    observaciones: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true, // Crea automáticamente createdAt y updatedAt
  },
);

// Índice para búsquedas rápidas por cliente y nombre
AssetSchema.index({ clientes: 1, nombre: 1 });

module.exports = mongoose.model("Asset", AssetSchema);

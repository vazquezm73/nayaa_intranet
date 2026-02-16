const mongoose = require('mongoose');

const CatalogSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  tipo: { 
    type: String, 
    required: true, 
    index: true // 'tipo_servicio', 'periodo_pago', 'status_contrato'
  },
  descripcion: String,
  activo: { type: Boolean, default: true },
  valorExtra: mongoose.Schema.Types.Mixed // Para guardar IPs de servidores default, etc.
}, { timestamps: true });

// Evitar duplicados del mismo nombre dentro del mismo tipo
CatalogSchema.index({ nombre: 1, tipo: 1 }, { unique: true });

module.exports = mongoose.model('Catalog', CatalogSchema);

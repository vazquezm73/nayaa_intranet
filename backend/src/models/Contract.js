const mongoose = require('mongoose');

const ContractSchema = new mongoose.Schema({
  folio: { type: String, unique: true }, // Ej: CON-2024-001
  cliente: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Client', 
    required: true 
  },
  tipoServicio: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Catalog', 
    required: true 
  }, // Ej: Hosting, Desarrollo
  asset: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Asset' 
  }, // El servidor ligado (opcional para desarrollo, req para hosting)
  
  nombreProyecto: { type: String, required: true },
  monto: { type: Number, required: true },
  moneda: { type: String, default: 'MXN' },
  
  periodoPago: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Catalog', 
    required: true 
  }, // Mensual, Anual
  
  fechaInicio: { type: Date, required: true },
  fechaFin: { type: Date },
  
  status: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Catalog', 
    required: true 
  }, // Vigente, Vencido, Suspendido
  
  detallesAdicionales: {
    dominio: String,
    ajustesHosting: String // Notas sobre cPanel, PHP version, etc.
  },
  
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

// Auto-generar folio antes de guardar (opcional pero profesional)
ContractSchema.pre('save', async function() {
  if (!this.folio) {
    this.folio = `CON-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  }
});

module.exports = mongoose.model('Contract', ContractSchema);

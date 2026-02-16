const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  
  // Control de Acceso
  role: { 
    type: String, 
    enum: ['admin', 'manager', 'staff'], 
    default: 'staff' 
  },
  
  // Permisos granulares para módulos
  permissions: [{ type: String }], 
  
  active: { type: Boolean, default: true },
  lastLogin: { type: Date }
}, { timestamps: true });

// Middleware: Encriptar contraseña antes de guardar
// backend/src/models/User.js

// Cambiamos a esto: eliminamos 'next' y la llamada a next()
UserSchema.pre('save', async function() {
  if (!this.isModified('password')) return; // Solo retornamos
  
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  // Ya no llamamos a next(), la promesa se resuelve sola al terminar
});
// Método para comparar contraseñas
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);

const mongoose = require('mongoose');
const config = require('./index');

const connectDB = async () => {
  try {
    await mongoose.connect(config.db.uri, config.db.options);
    console.log('✅ MongoDB Conectado exitosamente');
  } catch (err) {
    console.error('❌ Error de conexión a MongoDB:', err.message);
    // En producción, aquí podrías enviar una alerta
    process.exit(1);
  }
};

module.exports = connectDB;

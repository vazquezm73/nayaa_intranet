// backend/test-db.js
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
async function testConnection() {
  console.log('--- Intento de Conexión a MongoDB ---');
  console.log(`URI configurada: ${process.env.MONGO_URI.replace(/:([^:@]{3,})@/, ':****@')}`); // Oculta password en logs

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ EXITO: La conexión se estableció correctamente.');
    
    // Listar las colecciones para confirmar permisos
    const admin = mongoose.connection.db.admin();
    const dbs = await admin.listDatabases();
    console.log('✅ PERMISOS: Usuario puede ver bases de datos.');
    
    await mongoose.connection.close();
    console.log('--- Prueba Finalizada ---');
    process.exit(0);
  } catch (err) {
    console.error('❌ ERROR de Conexión:', err.message);
    console.log('\nPosibles causas:');
    if (err.message.includes('auth failed')) {
      console.log('- Usuario o contraseña incorrectos (revisa el encoding del "/")');
    } else if (err.message.includes('ECONNREFUSED')) {
      console.log('- El servicio MongoDB no está corriendo en Ubuntu (sudo systemctl start mongod)');
    }
    process.exit(1);
  }
}

testConnection();

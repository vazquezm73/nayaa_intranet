// backend/src/utils/seedAdmin.js
const mongoose = require('mongoose');
const config = require('../config');
const User = require('../models/User');

const seedAdmin = async () => {
  try {
    await mongoose.connect(config.db.uri);
    
    // Verificamos si ya existe un admin para no duplicar
    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists) {
      console.log('⚠️  Ya existe un usuario administrador en la base de datos.');
      process.exit();
    }

    const admin = new User({
      nombre: 'Administrador Principal',
      email: 'admin@intranet.local',
      password: 'AdminPassword123!', // En producción, usa algo más fuerte
      role: 'admin',
      permissions: ['all'], // Flag global para este usuario
      active: true
    });

    await admin.save();
    console.log('✅ Usuario administrador creado exitosamente:');
    console.log('   Email: admin@intranet.local');
    console.log('   Pass: AdminPassword123!');
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error al crear el administrador:', error);
    process.exit(1);
  }
};

seedAdmin();

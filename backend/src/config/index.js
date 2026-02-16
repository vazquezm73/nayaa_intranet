const dotenv = require('dotenv');
const path = require('path');

// Cargamos el .env
dotenv.config({ path: path.join(__dirname, '../../.env') });

const config = {
  // Banderas de Entorno
  env: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isStaging: process.env.NODE_ENV === 'staging',

  // Servidor
  server: {
    port: process.env.PORT || 3300,
    requireSsl: process.env.REQUIRE_SSL === 'true',
  },

  // Base de Datos
  db: {
    uri: process.env.MONGO_URI,
    options: {
    }
  },

  // Seguridad y Auth
  auth: {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: '8h',
    bcryptSaltRounds: 12, // Mayor seguridad para hashes en la intranet
  },

  // Configuración de Módulos (Banderas Globales)
  modules: {
    admin: {
      enabled: true,
      allowSelfRegistration: false, // Seguridad: solo el admin crea usuarios
    },
    audit: {
      enabled: true, // Siempre encendido por requerimiento de seguridad
    }
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  }
};

module.exports = config;

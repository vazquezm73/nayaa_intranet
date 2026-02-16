const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // 1. Verificar si viene el token en los headers (Authorization: Bearer <token>)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'No autorizado, falta el token' });
  }

  try {
    // 2. Verificar el token
    const decoded = jwt.verify(token, config.auth.jwtSecret);

    // 3. Buscar el usuario y adjuntarlo a la petición (req)
    // Usamos .select('-password') para no cargar el hash por seguridad
    req.user = await User.findById(decoded.id).select('-password');
    
    if (!req.user || !req.user.active) {
        return res.status(401).json({ message: 'Usuario inexistente o inactivo' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

module.exports = { protect };

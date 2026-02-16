const jwt = require('jsonwebtoken');
const config = require('../config');

// Generar un token JWT
exports.generateToken = (userId) => {
  return jwt.sign(
    { id: userId }, 
    config.auth.jwtSecret, 
    { expiresIn: config.auth.jwtExpiresIn }
  );
};

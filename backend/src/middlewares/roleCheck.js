// backend/src/middlewares/roleCheck.js
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `El rol ${req.user.role} no tiene permiso para esta acción` 
      });
    }
    next();
  };
};

module.exports = { authorize };

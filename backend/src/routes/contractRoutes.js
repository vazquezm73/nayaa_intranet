const express = require('express');
const router = express.Router();
const contractController = require('../controllers/contractController');
const { protect } = require('../middlewares/auth');
const { authorize } = require('../middlewares/roleCheck');

// Todas las rutas de contratos requieren autenticación
router.use(protect);

// Obtener lista de contratos y crear uno nuevo
router.get('/', contractController.getContracts);
router.post('/', authorize('admin', 'ventas'), contractController.createContract);

// Obtener un contrato específico, actualizarlo o eliminarlo
// (Asumiendo que luego agregaremos updateContract y deleteContract en el controlador)
/*
router.get('/:id', contractController.getContractById);
router.put('/:id', authorize('admin', 'ventas'), contractController.updateContract);
router.delete('/:id', authorize('admin'), contractController.deleteContract);
*/

module.exports = router;

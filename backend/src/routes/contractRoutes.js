const express = require("express");
const router = express.Router();
const contractController = require("../controllers/contractController");
const { protect } = require("../middlewares/auth");
const { authorize } = require("../middlewares/roleCheck");

// Todas las rutas de contratos requieren autenticación
router.use(protect);

// Obtener lista de contratos y crear uno nuevo
router.get("/", contractController.getContracts);
router.post(
  "/",
  authorize("admin", "ventas"),
  contractController.createContract,
);

module.exports = router;

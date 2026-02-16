const express = require("express");
const router = express.Router();
const clientController = require("../controllers/clientController");
const { protect } = require("../middlewares/auth");
const { authorize } = require("../middlewares/roleCheck");

// Todas las rutas de clientes requieren estar logueado
router.use(protect);

router.get("/", clientController.getClients);
router.get("/:id", clientController.getClientById);

// Rutas protegidas por rol
router.post("/", authorize("admin", "ventas"), clientController.createClient);
router.put("/:id", authorize("admin", "ventas"), clientController.updateClient); // <-- AGREGADA
router.delete("/:id", authorize("admin"), clientController.deleteClient); // <-- AGREGADA (Solo admin)

module.exports = router;

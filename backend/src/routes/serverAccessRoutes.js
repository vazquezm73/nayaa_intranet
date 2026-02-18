const express = require("express");
const router = express.Router();
const accessController = require("../controllers/serverAccessController");
const { protect } = require("../middlewares/auth");
const { authorize } = require("../middlewares/roleCheck");

router.use(protect); // Todas requieren login

// Solo admin puede ver la lista completa de contraseñas
router.get("/", authorize("admin"), accessController.getAllAccessInfo);

// Ver de un server específico (admin y staff)
router.get(
  "/asset/:assetId",
  authorize("admin", "staff"),
  accessController.getAccessByAsset,
);

// Crear o editar (admin y staff)
router.post("/", authorize("admin", "staff"), accessController.saveAccessInfo);

module.exports = router;

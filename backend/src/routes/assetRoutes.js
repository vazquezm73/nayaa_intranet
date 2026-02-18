const express = require("express");
const router = express.Router();
const assetController = require("../controllers/assetController");
const { protect } = require("../middlewares/auth");
const { authorize } = require("../middlewares/roleCheck");

router.use(protect); // Todas protegidas

// 1. RUTAS ESTÁTICAS (Siempre van primero)
router.get("/", assetController.getAssets);
router.get("/sync/contabo", authorize("admin"), assetController.syncContabo);
router.post("/test-alerts", authorize("admin"), assetController.testAlerts);

// 2. RUTAS CON PARÁMETROS (Siempre van al final)
router.post("/", authorize("admin", "staff"), assetController.createAsset);
router.put("/:id", authorize("admin", "staff"), assetController.updateAsset);
router.delete("/:id", authorize("admin"), assetController.deleteAsset);

module.exports = router;

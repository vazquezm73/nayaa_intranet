const express = require("express");
const router = express.Router();
const catalogController = require("../controllers/catalogController");
const { protect } = require("../middlewares/auth");
const { authorize } = require("../middlewares/roleCheck");

// Todos los usuarios autenticados pueden ver catálogos
// Solo administradores pueden gestionar la estructura
router.get("/", protect, catalogController.getCatalogs);
router.post("/", protect, authorize("admin"), catalogController.createCatalog);
router.put(
  "/:id",
  protect,
  authorize("admin"),
  catalogController.updateCatalog,
); // NUEVA
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  catalogController.deleteCatalog,
);

module.exports = router;

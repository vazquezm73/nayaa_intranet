const express = require("express");
const router = express.Router();
const assetController = require("../controllers/assetController");
const { protect } = require("../middlewares/auth");

router.use(protect); // Todas protegidas

router.get("/", assetController.getAssets);
router.post("/", assetController.createAsset);
router.put("/:id", assetController.updateAsset);
router.delete("/:id", assetController.deleteAsset);

module.exports = router;

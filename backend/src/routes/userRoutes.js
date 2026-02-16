const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { protect } = require("../middlewares/auth");
const { authorize } = require("../middlewares/roleCheck");

router.use(protect);
router.use(authorize("admin"));

router.get("/", userController.getUsers);
router.post("/", userController.createUser);
router.put("/:id", userController.updateUser);
router.patch("/:id/password", userController.resetPassword); // RUTA NUEVA

module.exports = router;

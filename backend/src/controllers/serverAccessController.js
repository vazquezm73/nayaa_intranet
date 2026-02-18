const ServerAccessInfo = require("../models/ServerAccessInfo");

// 1. Obtener todos los accesos (para la vista de lista completa)
exports.getAllAccessInfo = async (req, res) => {
  try {
    const info = await ServerAccessInfo.find().populate(
      "asset",
      "nombre ipPrincipal hostname",
    );
    res.json(info);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener lista de accesos", error });
  }
};

// 2. Obtener accesos de un servidor específico
exports.getAccessByAsset = async (req, res) => {
  try {
    const access = await ServerAccessInfo.findOne({
      asset: req.params.assetId,
    }).populate("asset", "nombre ipPrincipal hostname");

    if (!access) {
      return res
        .status(404)
        .json({
          message: "No hay credenciales registradas para este servidor",
        });
    }
    res.json(access);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener información de acceso", error });
  }
};

// 3. Guardar o Actualizar (Upsert)
exports.saveAccessInfo = async (req, res) => {
  try {
    const { asset } = req.body;
    // findOneAndUpdate con upsert: true crea el documento si no existe
    const info = await ServerAccessInfo.findOneAndUpdate(
      { asset },
      { ...req.body, updatedBy: req.user.id },
      { new: true, upsert: true, runValidators: true },
    );
    res.json(info);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al guardar credenciales", error: error.message });
  }
};

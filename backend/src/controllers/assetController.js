const Asset = require("../models/Asset");
const { checkExpirations } = require("../services/alertService");
const { syncContaboAssets } = require("../services/contaboService");

exports.getAssets = async (req, res) => {
  try {
    const { search, cliente, tipo, status, esCompartido } = req.query;
    let query = { active: true };

    // Filtro por Cliente (Busca si el ID del cliente está dentro del array 'clientes')
    if (cliente) query.clientes = { $in: [cliente] };

    if (tipo) query.tipoAsset = tipo;
    if (status) query.status = status;
    if (
      esCompartido !== undefined &&
      esCompartido !== "todos" &&
      esCompartido !== ""
    ) {
      query.esCompartido = esCompartido === "true";
    }
    if (search) {
      query.$or = [
        { nombre: { $regex: search, $options: "i" } },
        { ipPrincipal: { $regex: search, $options: "i" } },
        { hostname: { $regex: search, $options: "i" } },
      ];
    }

    const assets = await Asset.find(query)
      .populate("clientes", "nombreComercial contactoNombre") // Corregido a plural
      .populate("tipoAsset", "nombre")
      .populate("status", "nombre")
      .populate("proveedor", "nombre")
      .sort({ createdAt: -1 });

    res.json(assets);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener activos", error });
  }
};

exports.createAsset = async (req, res) => {
  try {
    const nuevoAsset = new Asset({
      ...req.body,
      createdBy: req.user.id,
    });

    await nuevoAsset.save();

    const assetPoblado = await Asset.findById(nuevoAsset._id)
      .populate("clientes", "nombreComercial") // Corregido a plural
      .populate("tipoAsset", "nombre")
      .populate("status", "nombre");

    res.status(201).json(assetPoblado);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el activo", error });
  }
};

exports.updateAsset = async (req, res) => {
  try {
    const assetActualizado = await Asset.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    ).populate("clientes tipoAsset status"); // Corregido a plural

    if (!assetActualizado)
      return res.status(404).json({ message: "Activo no encontrado" });
    res.json(assetActualizado);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el activo", error });
  }
};

exports.deleteAsset = async (req, res) => {
  try {
    await Asset.findByIdAndUpdate(req.params.id, { active: false });
    res.json({ message: "Activo desactivado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar activo" });
  }
};

exports.testAlerts = async (req, res) => {
  try {
    // Llamamos a la función que creamos en el servicio
    await checkExpirations();
    res.json({
      message: "Proceso de alertas disparado. Revisa Telegram y Email.",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al probar alertas", error: error.message });
  }
};

exports.syncContabo = async (req, res) => {
  try {
    const result = await syncContaboAssets();
    res.json({
      message: "Sincronización completada con éxito",
      details: result,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error al sincronizar con Contabo",
        error: error.message,
      });
  }
};

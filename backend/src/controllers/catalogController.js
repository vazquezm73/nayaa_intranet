const Catalog = require("../models/Catalog");

// 1. Obtener catálogos (Filtro por tipo o lista completa)
exports.getCatalogs = async (req, res) => {
  try {
    const { tipo } = req.query;
    const filter = { activo: true };
    if (tipo) filter.tipo = tipo;

    const catalogs = await Catalog.find(filter).sort({ tipo: 1, nombre: 1 });
    res.json(catalogs);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener catálogos", error });
  }
};

// 2. Crear un nuevo elemento
exports.createCatalog = async (req, res) => {
  try {
    const nuevoElemento = new Catalog(req.body);
    await nuevoElemento.save();
    res.status(201).json(nuevoElemento);
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({
          message: "Ya existe un elemento con ese nombre en este catálogo",
        });
    }
    res.status(500).json({ message: "Error al crear el catálogo", error });
  }
};

// 3. ACTUALIZACIÓN (Faltaba en tu código)
exports.updateCatalog = async (req, res) => {
  try {
    const { id } = req.params;
    const actualizado = await Catalog.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!actualizado) return res.status(404).json({ message: "No encontrado" });
    res.json(actualizado);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar", error });
  }
};

// 4. Inactivar (Soft Delete)
exports.deleteCatalog = async (req, res) => {
  try {
    const { id } = req.params;
    await Catalog.findByIdAndUpdate(id, { activo: false });
    res.json({ message: "Catálogo inactivado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar", error });
  }
};

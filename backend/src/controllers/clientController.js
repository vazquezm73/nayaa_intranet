const Client = require("../models/Client");

// Obtener todos los clientes (con búsqueda y población de catálogos)

exports.getClients = async (req, res) => {
  try {
    const { search, status } = req.query;

    // Cambiamos la lógica:
    // Si status es 'inactive', buscamos active: false
    // Por defecto (si no viene o es cualquier otra cosa), buscamos active: true
    let query = {};

    if (status === "inactive") {
      query.active = false;
    } else {
      query.active = true;
    }

    // Mantener la lógica de búsqueda por nombre
    if (search) {
      query.nombreComercial = { $regex: search, $options: "i" };
    }

    const clients = await Client.find(query)
      .populate("tipoCliente", "nombre")
      .sort({ nombreComercial: 1 });

    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener clientes", error });
  }
};

// Crear un nuevo cliente
exports.createClient = async (req, res) => {
  try {
    const data = { ...req.body };

    // Si viene vacío, convertir a null
    if (data.rfcTaxId === "" || data.rfcTaxId === undefined) {
      data.rfcTaxId = null;
    } else {
      // Normalizar si existe
      data.rfcTaxId = data.rfcTaxId.trim().toUpperCase();
    }

    const nuevoCliente = new Client({
      ...data,
      createdBy: req.user.id,
    });

    await nuevoCliente.save();
    res.status(201).json(nuevoCliente);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "El RFC/TaxID ya está registrado",
      });
    }
    res.status(500).json({ message: "Error al crear cliente", error });
  }
};

// Obtener un cliente específico por ID
exports.getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id).populate(
      "tipoCliente",
      "nombre",
    );
    if (!client)
      return res.status(404).json({ message: "Cliente no encontrado" });
    res.json(client);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el cliente", error });
  }
};
// En tu controller de Clientes (Backend)
exports.deleteClient = async (req, res) => {
  try {
    const { id } = req.params;
    // Cambiamos active a false en lugar de borrar el documento
    await Client.findByIdAndUpdate(id, { active: false });
    res.json({ message: "Cliente inactivado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar cliente", error });
  }
};
// Actualizar un cliente
exports.updateClient = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("🆔 ID a actualizar:", id);

    // Verificar que el cliente existe
    const clienteExistente = await Client.findById(id);
    console.log("👤 Cliente encontrado:", clienteExistente ? "SÍ" : "NO");

    if (!clienteExistente) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    const data = { ...req.body };

    console.log("📝 Datos recibidos:", data);
    console.log("🔍 RFC original:", data.rfcTaxId);

    // Normalizar RFC
    if (
      data.rfcTaxId === "" ||
      data.rfcTaxId === undefined ||
      data.rfcTaxId === "null"
    ) {
      data.rfcTaxId = null;
    } else if (data.rfcTaxId !== null) {
      data.rfcTaxId = data.rfcTaxId.trim().toUpperCase();
    }

    console.log("✅ RFC procesado:", data.rfcTaxId);

    // VALIDACIÓN MANUAL: Solo si el RFC NO es null
    if (data.rfcTaxId !== null) {
      const rfcExistente = await Client.findOne({
        rfcTaxId: data.rfcTaxId,
        _id: { $ne: id },
      });

      if (rfcExistente) {
        return res.status(400).json({
          message: "El RFC/TaxID ya está registrado en otro cliente",
        });
      }
    }

    const clienteActualizado = await Client.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).populate("tipoCliente", "nombre");

    if (!clienteActualizado) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    console.log("🎉 Cliente actualizado:", clienteActualizado);
    res.json(clienteActualizado);
  } catch (error) {
    // MEJORAR EL LOGGING DE ERRORES
    console.error("❌ Error completo:", error);
    console.error("❌ Error name:", error.name);
    console.error("❌ Error message:", error.message);
    console.error("❌ Error code:", error.code);

    if (error.code === 11000) {
      return res.status(400).json({
        message: "El RFC/TaxID ya está registrado",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Error de validación",
        details: error.message,
      });
    }

    if (error.name === "CastError") {
      return res.status(400).json({
        message: "ID inválido o referencia incorrecta",
        details: error.message,
      });
    }

    res.status(500).json({
      message: "Error al actualizar cliente",
      error: error.message,
      details: error.toString(),
    });
  }
};

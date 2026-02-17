const User = require("../models/User");

// Obtener todos los usuarios (sin incluir contraseñas)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuarios", error });
  }
};

// Crear nuevo usuario (la contraseña se encripta en el modelo)
exports.createUser = async (req, res) => {
  try {
    const { email } = req.body;
    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "El email ya está registrado" });

    const newUser = new User(req.body);
    await newUser.save();

    const userResponse = newUser.toObject();
    delete userResponse.password; // Seguridad
    res.status(201).json(userResponse);
  } catch (error) {
    res.status(500).json({ message: "Error al crear usuario", error });
  }
};

// Actualizar usuario o cambiar estado activo/inactivo
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const data = { ...req.body };

    // SEGURIDAD: Bloqueo de autodesactivación con mensaje personalizado
    if (id === req.user._id.toString() && data.active === false) {
      return res.status(400).json({
        message: "No se puede deshabilitar el administrador del Sistema",
      });
    }

    delete data.password;
    const updatedUser = await User.findByIdAndUpdate(id, data, {
      new: true,
    }).select("-password");
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar usuario", error });
  }
};

// Cambiar contraseña (Solo Admin)
exports.resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password)
      return res
        .status(400)
        .json({ message: "La nueva contraseña es obligatoria" });

    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    user.password = password; // El middleware pre('save') la encriptará
    await user.save();

    res.json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al resetear contraseña", error });
  }
};

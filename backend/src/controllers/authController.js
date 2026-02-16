const User = require('../models/User');
const { generateToken } = require('../services/authService');

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Verificar que el usuario existe
        const user = await User.findOne({ email });
        if (!user || !user.active) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // 2. Verificar contraseña (usando el método del modelo User)
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // 3. Actualizar fecha de último login (opcional pero recomendado)
        user.lastLogin = Date.now();
        await user.save();

        // 4. Responder con el Token y datos básicos
        res.json({
            token: generateToken(user._id),
            user: {
                id: user._id,
                nombre: user.nombre,
                role: user.role,
                permissions: user.permissions
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

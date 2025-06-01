const jwt = require('jsonwebtoken');
const Usuario = require('../modelos/Usuario');

const autenticacion = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        error: true,
        mensaje: 'No se proporcionó token de autenticación'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await Usuario.findById(decoded.id);

    if (!usuario) {
      return res.status(401).json({
        error: true,
        mensaje: 'Token inválido'
      });
    }

    req.usuario = usuario;
    next();
  } catch (error) {
    console.error('Error en autenticación:', error);
    res.status(401).json({
      error: true,
      mensaje: 'Error de autenticación'
    });
  }
};

module.exports = autenticacion; 
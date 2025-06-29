const jwt = require('jsonwebtoken');
// const Usuario = require('../modelos/Usuario'); // Eliminado: ya no se usa
const prisma = require('../configuracion/prisma');

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
    // Usar Prisma para buscar el usuario por id
    const usuario = await prisma.usuario.findUnique({
      where: { id: decoded.id }
    });

    if (!usuario) {
      return res.status(401).json({
        error: true,
        mensaje: 'Token inválido'
      });
    }

    req.usuario = usuario;
    console.log('user:', usuario, 'token:', token);
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
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
// const Usuario = require('../modelos/Usuario'); // Eliminado: ya no se usa
const prisma = require('../configuracion/prisma');

class ControladorAutenticacion {
  static async registro(req, res) {
    try {
      const { nombre, email, contraseña, foto_url, ubicacion } = req.body;

      // Verificar si el usuario ya existe usando Prisma
      const usuarioExistente = await prisma.usuario.findUnique({
        where: { email }
      });
      if (usuarioExistente) {
        return res.status(400).json({
          error: true,
          mensaje: 'El correo electrónico ya está registrado'
        });
      }

      // Hashear la contraseña
      const contraseñaHasheada = await bcrypt.hash(contraseña, 10);

      // Crear nuevo usuario usando Prisma
      const usuario = await prisma.usuario.create({
        data: {
          nombre,
          email,
          contraseña: contraseñaHasheada,
          foto_url,
          ubicacion
        }
      });

      // Generar token
      const token = jwt.sign(
        { id: usuario.id },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      // No enviar la contraseña en la respuesta
      const { contraseña: _, ...usuarioSinContraseña } = usuario;

      res.status(201).json({
        error: false,
        mensaje: 'Usuario registrado exitosamente',
        datos: {
          usuario: usuarioSinContraseña,
          token
        }
      });
    } catch (error) {
      console.error('Error en registro:', error);
      res.status(500).json({
        error: true,
        mensaje: 'Error al registrar usuario'
      });
    }
  }

  static async inicioSesion(req, res) {
    try {
      const { email, contraseña } = req.body;

      // Buscar usuario usando Prisma
      const usuario = await prisma.usuario.findUnique({
        where: { email }
      });
      if (!usuario) {
        return res.status(401).json({
          error: true,
          mensaje: 'Credenciales inválidas'
        });
      }

      // Verificar contraseña usando bcrypt
      const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);
      if (!contraseñaValida) {
        return res.status(401).json({
          error: true,
          mensaje: 'Credenciales inválidas'
        });
      }

      // Generar token
      const token = jwt.sign(
        { id: usuario.id },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      // No enviar la contraseña en la respuesta
      const { contraseña: _, ...usuarioSinContraseña } = usuario;

      res.json({
        error: false,
        mensaje: 'Inicio de sesión exitoso',
        datos: {
          usuario: usuarioSinContraseña,
          token
        }
      });
    } catch (error) {
      console.error('Error en inicio de sesión:', error);
      res.status(500).json({
        error: true,
        mensaje: 'Error al iniciar sesión'
      });
    }
  }

  static async obtenerPerfil(req, res) {
    try {
      const usuario = await prisma.usuario.findUnique({
        where: { id: req.usuario.id }
      });
      if (!usuario) {
        return res.status(404).json({
          error: true,
          mensaje: 'Usuario no encontrado'
        });
      }

      // No enviar la contraseña en la respuesta
      const { contraseña: _, ...usuarioSinContraseña } = usuario;

      res.json({
        error: false,
        datos: usuarioSinContraseña
      });
    } catch (error) {
      console.error('Error al obtener perfil:', error);
      res.status(500).json({
        error: true,
        mensaje: 'Error al obtener perfil'
      });
    }
  }
}

module.exports = ControladorAutenticacion; 
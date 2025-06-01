const jwt = require('jsonwebtoken');
const Usuario = require('../modelos/Usuario');

class ControladorAutenticacion {
  static async registro(req, res) {
    try {
      const { nombre, email, contraseña, foto_url, ubicacion } = req.body;

      // Verificar si el usuario ya existe
      const usuarioExistente = await Usuario.findByEmail(email);
      if (usuarioExistente) {
        return res.status(400).json({
          error: true,
          mensaje: 'El correo electrónico ya está registrado'
        });
      }

      // Crear nuevo usuario
      const usuario = await Usuario.create({
        nombre,
        email,
        contraseña,
        foto_url,
        ubicacion
      });

      // Generar token
      const token = jwt.sign(
        { id: usuario.id },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(201).json({
        error: false,
        mensaje: 'Usuario registrado exitosamente',
        datos: {
          usuario,
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

      // Buscar usuario
      const usuario = await Usuario.findByEmail(email);
      if (!usuario) {
        return res.status(401).json({
          error: true,
          mensaje: 'Credenciales inválidas'
        });
      }

      // Verificar contraseña
      const contraseñaValida = await Usuario.verifyPassword(usuario, contraseña);
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

      res.json({
        error: false,
        mensaje: 'Inicio de sesión exitoso',
        datos: {
          usuario,
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
      const usuario = await Usuario.findById(req.usuario.id);
      if (!usuario) {
        return res.status(404).json({
          error: true,
          mensaje: 'Usuario no encontrado'
        });
      }

      res.json({
        error: false,
        datos: usuario
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
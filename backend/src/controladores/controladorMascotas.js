// const Mascota = require('../modelos/Mascota'); // Eliminado: ya no se usa
const prisma = require('../configuracion/prisma');

class ControladorMascotas {
  static async crear(req, res) {
    try {
      const nuevaMascota = await prisma.mascota.create({
        data: {
          idUsuario: req.usuario.id,
          nombre: req.body.nombre,
          especie: req.body.especie,
          raza: req.body.raza,
          edad: req.body.edad,
          temperamento: req.body.temperamento,
          foto_url: req.body.foto_url
        },
        include: {
          usuario: {
            select: {
              id: true,
              nombre: true,
              email: true,
              foto_url: true
            }
          }
        }
      });
      
      res.status(201).json({
        error: false,
        mensaje: 'Mascota creada exitosamente',
        datos: nuevaMascota
      });
    } catch (error) {
      console.error('Error al crear mascota:', error);
      res.status(500).json({ 
        error: true,
        mensaje: 'Error al crear mascota', 
        detalle: error.message 
      });
    }
  }

  static async obtenerMascotasUsuario(req, res) {
    try {
      const mascotas = await prisma.mascota.findMany({
        where: {
          idUsuario: req.usuario.id
        },
        include: {
          usuario: {
            select: {
              id: true,
              nombre: true,
              email: true,
              foto_url: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      res.json({
        error: false,
        datos: mascotas
      });
    } catch (error) {
      console.error('Error al obtener mascotas:', error);
      res.status(500).json({ 
        error: true,
        mensaje: 'Error al obtener mascotas', 
        detalle: error.message 
      });
    }
  }

  static async obtenerMascota(req, res) {
    try {
      const mascota = await prisma.mascota.findUnique({
        where: { id: parseInt(req.params.id) },
        include: {
          usuario: {
            select: {
              id: true,
              nombre: true,
              email: true,
              foto_url: true
            }
          }
        }
      });
      
      if (!mascota) {
        return res.status(404).json({ 
          error: true,
          mensaje: 'Mascota no encontrada' 
        });
      }
      
      res.json({
        error: false,
        datos: mascota
      });
    } catch (error) {
      console.error('Error al obtener mascota:', error);
      res.status(500).json({ 
        error: true,
        mensaje: 'Error al obtener mascota', 
        detalle: error.message 
      });
    }
  }

  static async actualizar(req, res) {
    try {
      // Verificar que la mascota pertenece al usuario
      const mascotaExistente = await prisma.mascota.findFirst({
        where: {
          id: parseInt(req.params.id),
          idUsuario: req.usuario.id
        }
      });

      if (!mascotaExistente) {
        return res.status(404).json({ 
          error: true,
          mensaje: 'Mascota no encontrada o no tienes permisos para editarla' 
        });
      }

      const mascota = await prisma.mascota.update({
        where: { id: parseInt(req.params.id) },
        data: {
          nombre: req.body.nombre,
          especie: req.body.especie,
          raza: req.body.raza,
          edad: req.body.edad,
          temperamento: req.body.temperamento,
          foto_url: req.body.foto_url
        },
        include: {
          usuario: {
            select: {
              id: true,
              nombre: true,
              email: true,
              foto_url: true
            }
          }
        }
      });
      
      res.json({
        error: false,
        mensaje: 'Mascota actualizada exitosamente',
        datos: mascota
      });
    } catch (error) {
      console.error('Error al actualizar mascota:', error);
      res.status(500).json({ 
        error: true,
        mensaje: 'Error al actualizar mascota', 
        detalle: error.message 
      });
    }
  }

  static async eliminar(req, res) {
    try {
      // Verificar que la mascota pertenece al usuario
      const mascotaExistente = await prisma.mascota.findFirst({
        where: {
          id: parseInt(req.params.id),
          idUsuario: req.usuario.id
        }
      });

      if (!mascotaExistente) {
        return res.status(404).json({ 
          error: true,
          mensaje: 'Mascota no encontrada o no tienes permisos para eliminarla' 
        });
      }

      const mascota = await prisma.mascota.delete({
        where: { id: parseInt(req.params.id) }
      });
      
      res.json({
        error: false,
        mensaje: 'Mascota eliminada exitosamente',
        datos: mascota
      });
    } catch (error) {
      console.error('Error al eliminar mascota:', error);
      res.status(500).json({ 
        error: true,
        mensaje: 'Error al eliminar mascota', 
        detalle: error.message 
      });
    }
  }
}

module.exports = ControladorMascotas; 
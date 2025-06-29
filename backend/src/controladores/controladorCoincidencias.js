// const CoincidenciaMascota = require('../modelos/CoincidenciaMascota'); // Eliminado: ya no se usa
const prisma = require('../configuracion/prisma');

class ControladorCoincidencias {
  static async crear(req, res) {
    try {
      const { id_mascota_1, id_mascota_2 } = req.body;
      
      // Verificar que las mascotas existen
      const mascota1 = await prisma.mascota.findUnique({
        where: { id: parseInt(id_mascota_1) }
      });
      
      const mascota2 = await prisma.mascota.findUnique({
        where: { id: parseInt(id_mascota_2) }
      });
      
      if (!mascota1 || !mascota2) {
        return res.status(400).json({
          error: true,
          mensaje: 'Una o ambas mascotas no existen'
        });
      }
      
      // Verificar que no existe ya una coincidencia entre estas mascotas
      const coincidenciaExistente = await prisma.coincidenciaMascota.findFirst({
        where: {
          OR: [
            {
              idMascota1: parseInt(id_mascota_1),
              idMascota2: parseInt(id_mascota_2)
            },
            {
              idMascota1: parseInt(id_mascota_2),
              idMascota2: parseInt(id_mascota_1)
            }
          ]
        }
      });
      
      if (coincidenciaExistente) {
        return res.status(400).json({
          error: true,
          mensaje: 'Ya existe una coincidencia entre estas mascotas'
        });
      }
      
      const coincidencia = await prisma.coincidenciaMascota.create({
        data: {
          idMascota1: parseInt(id_mascota_1),
          idMascota2: parseInt(id_mascota_2),
          estado: 'pendiente'
        },
        include: {
          mascota1: {
            include: {
              usuario: {
                select: {
                  id: true,
                  nombre: true,
                  foto_url: true
                }
              }
            }
          },
          mascota2: {
            include: {
              usuario: {
                select: {
                  id: true,
                  nombre: true,
                  foto_url: true
                }
              }
            }
          }
        }
      });
      
      res.status(201).json({
        error: false,
        mensaje: 'Coincidencia creada exitosamente',
        datos: coincidencia
      });
    } catch (error) {
      console.error('Error al crear coincidencia:', error);
      res.status(500).json({ 
        error: true,
        mensaje: 'Error al crear coincidencia', 
        detalle: error.message 
      });
    }
  }

  static async actualizarEstado(req, res) {
    try {
      const { id } = req.params;
      const { estado } = req.body;
      
      // Verificar que el estado es válido
      const estadosValidos = ['pendiente', 'aceptada', 'rechazada'];
      if (!estadosValidos.includes(estado)) {
        return res.status(400).json({
          error: true,
          mensaje: 'Estado no válido. Debe ser: pendiente, aceptada o rechazada'
        });
      }
      
      const coincidencia = await prisma.coincidenciaMascota.update({
        where: { id: parseInt(id) },
        data: { estado },
        include: {
          mascota1: {
            include: {
              usuario: {
                select: {
                  id: true,
                  nombre: true,
                  foto_url: true
                }
              }
            }
          },
          mascota2: {
            include: {
              usuario: {
                select: {
                  id: true,
                  nombre: true,
                  foto_url: true
                }
              }
            }
          }
        }
      });
      
      res.json({
        error: false,
        mensaje: 'Estado de coincidencia actualizado exitosamente',
        datos: coincidencia
      });
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      res.status(500).json({ 
        error: true,
        mensaje: 'Error al actualizar estado', 
        detalle: error.message 
      });
    }
  }

  static async obtenerPorMascota(req, res) {
    try {
      const { id_mascota } = req.params;
      
      const coincidencias = await prisma.coincidenciaMascota.findMany({
        where: {
          OR: [
            { idMascota1: parseInt(id_mascota) },
            { idMascota2: parseInt(id_mascota) }
          ]
        },
        include: {
          mascota1: {
            include: {
              usuario: {
                select: {
                  id: true,
                  nombre: true,
                  foto_url: true
                }
              }
            }
          },
          mascota2: {
            include: {
              usuario: {
                select: {
                  id: true,
                  nombre: true,
                  foto_url: true
                }
              }
            }
          }
        },
        orderBy: {
          updatedAt: 'desc'
        }
      });
      
      res.json({
        error: false,
        datos: coincidencias
      });
    } catch (error) {
      console.error('Error al obtener coincidencias:', error);
      res.status(500).json({ 
        error: true,
        mensaje: 'Error al obtener coincidencias', 
        detalle: error.message 
      });
    }
  }

  static async obtenerPendientes(req, res) {
    try {
      const { id_mascota } = req.params;
      
      const coincidencias = await prisma.coincidenciaMascota.findMany({
        where: {
          OR: [
            { idMascota1: parseInt(id_mascota) },
            { idMascota2: parseInt(id_mascota) }
          ],
          estado: 'pendiente'
        },
        include: {
          mascota1: {
            include: {
              usuario: {
                select: {
                  id: true,
                  nombre: true,
                  foto_url: true
                }
              }
            }
          },
          mascota2: {
            include: {
              usuario: {
                select: {
                  id: true,
                  nombre: true,
                  foto_url: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      res.json({
        error: false,
        datos: coincidencias
      });
    } catch (error) {
      console.error('Error al obtener coincidencias pendientes:', error);
      res.status(500).json({ 
        error: true,
        mensaje: 'Error al obtener coincidencias pendientes', 
        detalle: error.message 
      });
    }
  }
}

module.exports = ControladorCoincidencias; 
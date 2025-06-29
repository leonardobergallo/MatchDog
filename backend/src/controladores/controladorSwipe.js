// const Mascota = require('../modelos/Mascota'); // Eliminado: ya no se usa
const prisma = require('../configuracion/prisma');

class ControladorSwipe {
  static async obtenerCandidatas(req, res) {
    try {
      const { id_mascota } = req.params;
      
      // Obtener la mascota actual para conocer sus características
      const mascotaActual = await prisma.mascota.findUnique({
        where: { id: parseInt(id_mascota) },
        include: {
          usuario: {
            select: {
              id: true,
              nombre: true,
              ubicacion: true
            }
          }
        }
      });
      
      if (!mascotaActual) {
        return res.status(404).json({
          error: true,
          mensaje: 'Mascota no encontrada'
        });
      }
      
      // Obtener todas las mascotas que no sean del mismo usuario y que no hayan sido swiped
      const candidatas = await prisma.mascota.findMany({
        where: {
          idUsuario: {
            not: mascotaActual.idUsuario
          },
          id: {
            not: parseInt(id_mascota)
          },
          // Excluir mascotas que ya tienen coincidencias (swipes previos)
          AND: [
            {
              coincidenciasComoMascota1: {
                none: {
                  idMascota2: parseInt(id_mascota)
                }
              }
            },
            {
              coincidenciasComoMascota2: {
                none: {
                  idMascota1: parseInt(id_mascota)
                }
              }
            }
          ]
        },
        include: {
          usuario: {
            select: {
              id: true,
              nombre: true,
              ubicacion: true,
              foto_url: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 20 // Limitar a 20 candidatas por vez
      });
      
      res.json({
        error: false,
        datos: candidatas
      });
    } catch (error) {
      console.error('Error al obtener candidatas:', error);
      res.status(500).json({ 
        error: true,
        mensaje: 'Error al obtener candidatas', 
        detalle: error.message 
      });
    }
  }

  static async realizarSwipe(req, res) {
    try {
      const { id_mascota_origen, id_mascota_destino, accion } = req.body;
      
      // Verificar que las mascotas existen
      const mascotaOrigen = await prisma.mascota.findUnique({
        where: { id: parseInt(id_mascota_origen) }
      });
      
      const mascotaDestino = await prisma.mascota.findUnique({
        where: { id: parseInt(id_mascota_destino) }
      });
      
      if (!mascotaOrigen || !mascotaDestino) {
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
              idMascota1: parseInt(id_mascota_origen),
              idMascota2: parseInt(id_mascota_destino)
            },
            {
              idMascota1: parseInt(id_mascota_destino),
              idMascota2: parseInt(id_mascota_origen)
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
      
      let resultado;
      
      if (accion === 'like') {
        // Crear coincidencia pendiente
        resultado = await prisma.coincidenciaMascota.create({
          data: {
            idMascota1: parseInt(id_mascota_origen),
            idMascota2: parseInt(id_mascota_destino),
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
        
        res.json({
          error: false,
          mensaje: 'Swipe realizado exitosamente',
          datos: resultado
        });
      } else if (accion === 'pass') {
        // Para pass, simplemente registramos que no hay interés
        // Podríamos crear un registro de "pass" si queremos evitar mostrar la misma mascota
        res.json({
          error: false,
          mensaje: 'Swipe de pass registrado'
        });
      } else {
        return res.status(400).json({
          error: true,
          mensaje: 'Acción no válida. Debe ser "like" o "pass"'
        });
      }
      
    } catch (error) {
      console.error('Error al realizar swipe:', error);
      res.status(500).json({ 
        error: true,
        mensaje: 'Error al realizar swipe', 
        detalle: error.message 
      });
    }
  }
}

module.exports = ControladorSwipe; 
const prisma = require('../configuracion/prisma');

class ControladorEventos {
  static async crear(req, res) {
    try {
      const nuevoEvento = await prisma.evento.create({
        data: {
          idOrganizador: req.usuario.id,
          titulo: req.body.titulo,
          descripcion: req.body.descripcion,
          tipo: req.body.tipo,
          fechaHora: new Date(req.body.fecha_hora),
          nombreUbicacion: req.body.nombre_ubicacion,
          latitud: parseFloat(req.body.latitud),
          longitud: parseFloat(req.body.longitud),
          reglas: req.body.reglas,
          imagen_url: req.body.imagen_url
        },
        include: {
          organizador: {
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
        mensaje: 'Evento creado exitosamente',
        datos: nuevoEvento
      });
    } catch (error) {
      console.error('Error al crear evento:', error);
      res.status(500).json({ 
        error: true,
        mensaje: 'Error al crear evento', 
        detalle: error.message 
      });
    }
  }

  static async obtenerEventosCercanos(req, res) {
    try {
      const { latitud, longitud, radio = 10 } = req.query;
      
      // Convertir a números
      const lat = parseFloat(latitud);
      const lng = parseFloat(longitud);
      const radius = parseFloat(radio);
      
      // Calcular límites aproximados (simplificado)
      const latMin = lat - (radius / 111); // 1 grado ≈ 111 km
      const latMax = lat + (radius / 111);
      const lngMin = lng - (radius / (111 * Math.cos(lat * Math.PI / 180)));
      const lngMax = lng + (radius / (111 * Math.cos(lat * Math.PI / 180)));
      
      const eventos = await prisma.evento.findMany({
        where: {
          latitud: {
            gte: latMin,
            lte: latMax
          },
          longitud: {
            gte: lngMin,
            lte: lngMax
          },
          fechaHora: {
            gte: new Date() // Solo eventos futuros
          }
        },
        include: {
          organizador: {
            select: {
              id: true,
              nombre: true,
              email: true,
              foto_url: true
            }
          },
          asistencias: {
            include: {
              usuario: {
                select: {
                  id: true,
                  nombre: true,
                  foto_url: true
                }
              },
              mascota: {
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
          fechaHora: 'asc'
        }
      });
      
      res.json({
        error: false,
        datos: eventos
      });
    } catch (error) {
      console.error('Error al obtener eventos cercanos:', error);
      res.status(500).json({ 
        error: true,
        mensaje: 'Error al obtener eventos cercanos', 
        detalle: error.message 
      });
    }
  }

  static async obtenerEvento(req, res) {
    try {
      const evento = await prisma.evento.findUnique({
        where: { id: parseInt(req.params.id) },
        include: {
          organizador: {
            select: {
              id: true,
              nombre: true,
              email: true,
              foto_url: true
            }
          },
          asistencias: {
            include: {
              usuario: {
                select: {
                  id: true,
                  nombre: true,
                  foto_url: true
                }
              },
              mascota: {
                select: {
                  id: true,
                  nombre: true,
                  foto_url: true
                }
              }
            }
          },
          mensajes: {
            include: {
              remitente: {
                select: {
                  id: true,
                  nombre: true,
                  foto_url: true
                }
              }
            },
            orderBy: {
              createdAt: 'desc'
            }
          }
        }
      });
      
      if (!evento) {
        return res.status(404).json({ 
          error: true,
          mensaje: 'Evento no encontrado' 
        });
      }
      
      res.json({
        error: false,
        datos: evento
      });
    } catch (error) {
      console.error('Error al obtener evento:', error);
      res.status(500).json({ 
        error: true,
        mensaje: 'Error al obtener evento', 
        detalle: error.message 
      });
    }
  }

  static async actualizar(req, res) {
    try {
      // Verificar que el evento pertenece al usuario
      const eventoExistente = await prisma.evento.findFirst({
        where: {
          id: parseInt(req.params.id),
          idOrganizador: req.usuario.id
        }
      });

      if (!eventoExistente) {
        return res.status(404).json({ 
          error: true,
          mensaje: 'Evento no encontrado o no tienes permisos para editarlo' 
        });
      }

      const evento = await prisma.evento.update({
        where: { id: parseInt(req.params.id) },
        data: {
          titulo: req.body.titulo,
          descripcion: req.body.descripcion,
          tipo: req.body.tipo,
          fechaHora: req.body.fecha_hora ? new Date(req.body.fecha_hora) : undefined,
          nombreUbicacion: req.body.nombre_ubicacion,
          latitud: req.body.latitud ? parseFloat(req.body.latitud) : undefined,
          longitud: req.body.longitud ? parseFloat(req.body.longitud) : undefined,
          reglas: req.body.reglas,
          imagen_url: req.body.imagen_url
        },
        include: {
          organizador: {
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
        mensaje: 'Evento actualizado exitosamente',
        datos: evento
      });
    } catch (error) {
      console.error('Error al actualizar evento:', error);
      res.status(500).json({ 
        error: true,
        mensaje: 'Error al actualizar evento', 
        detalle: error.message 
      });
    }
  }

  static async eliminar(req, res) {
    try {
      // Verificar que el evento pertenece al usuario
      const eventoExistente = await prisma.evento.findFirst({
        where: {
          id: parseInt(req.params.id),
          idOrganizador: req.usuario.id
        }
      });

      if (!eventoExistente) {
        return res.status(404).json({ 
          error: true,
          mensaje: 'Evento no encontrado o no tienes permisos para eliminarlo' 
        });
      }

      const evento = await prisma.evento.delete({
        where: { id: parseInt(req.params.id) }
      });
      
      res.json({
        error: false,
        mensaje: 'Evento eliminado exitosamente',
        datos: evento
      });
    } catch (error) {
      console.error('Error al eliminar evento:', error);
      res.status(500).json({ 
        error: true,
        mensaje: 'Error al eliminar evento', 
        detalle: error.message 
      });
    }
  }

  static async getAttendees(req, res) {
    try {
      const asistentes = await prisma.asistenciaEvento.findMany({
        where: {
          idEvento: parseInt(req.params.id)
        },
        include: {
          usuario: {
            select: {
              id: true,
              nombre: true,
              email: true,
              foto_url: true
            }
          },
          mascota: {
            select: {
              id: true,
              nombre: true,
              especie: true,
              raza: true,
              foto_url: true
            }
          }
        },
        orderBy: {
          createdAt: 'asc'
        }
      });
      
      res.json({
        error: false,
        datos: asistentes
      });
    } catch (error) {
      console.error('Error al obtener asistentes:', error);
      res.status(500).json({ 
        error: true,
        mensaje: 'Error al obtener asistentes', 
        detalle: error.message 
      });
    }
  }

  static async registrar(req, res) {
    try {
      const { id_mascota } = req.body;
      
      // Verificar que la mascota pertenece al usuario
      const mascota = await prisma.mascota.findFirst({
        where: {
          id: parseInt(id_mascota),
          idUsuario: req.usuario.id
        }
      });

      if (!mascota) {
        return res.status(400).json({
          error: true,
          mensaje: 'Mascota no encontrada o no tienes permisos para usarla'
        });
      }

      const asistencia = await prisma.asistenciaEvento.create({
        data: {
          idEvento: parseInt(req.params.id),
          idUsuario: req.usuario.id,
          idMascota: parseInt(id_mascota)
        },
        include: {
          usuario: {
            select: {
              id: true,
              nombre: true,
              foto_url: true
            }
          },
          mascota: {
            select: {
              id: true,
              nombre: true,
              foto_url: true
            }
          },
          evento: {
            select: {
              id: true,
              titulo: true,
              fechaHora: true
            }
          }
        }
      });
      
      res.status(201).json({
        error: false,
        mensaje: 'Asistencia registrada exitosamente',
        datos: asistencia
      });
    } catch (error) {
      console.error('Error al registrar asistencia:', error);
      if (error.code === 'P2002') {
        return res.status(400).json({
          error: true,
          mensaje: 'Ya estás registrado en este evento'
        });
      }
      res.status(500).json({ 
        error: true,
        mensaje: 'Error al registrar asistencia', 
        detalle: error.message 
      });
    }
  }

  static async desregistrar(req, res) {
    try {
      const asistencia = await prisma.asistenciaEvento.deleteMany({
        where: {
          idEvento: parseInt(req.params.id),
          idUsuario: req.usuario.id
        }
      });
      
      if (asistencia.count === 0) {
        return res.status(404).json({
          error: true,
          mensaje: 'No estás registrado en este evento'
        });
      }
      
      res.json({
        error: false,
        mensaje: 'Asistencia cancelada exitosamente'
      });
    } catch (error) {
      console.error('Error al desregistrar asistencia:', error);
      res.status(500).json({ 
        error: true,
        mensaje: 'Error al desregistrar asistencia', 
        detalle: error.message 
      });
    }
  }
}

module.exports = ControladorEventos; 
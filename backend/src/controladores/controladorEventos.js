const Evento = require('../modelos/Evento');
const AsistenciaEvento = require('../modelos/AsistenciaEvento');

class ControladorEventos {
  static async crear(req, res) {
    try {
      const nuevoEvento = await Evento.create({
        id_organizador: req.usuario.id,
        ...req.body
      });
      res.status(201).json(nuevoEvento);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear evento', detalle: error.message });
    }
  }

  static async obtenerEventosCercanos(req, res) {
    try {
      const { latitud, longitud, radio } = req.query;
      const eventos = await Evento.findNearby(latitud, longitud, radio);
      res.json(eventos);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener eventos cercanos', detalle: error.message });
    }
  }

  static async obtenerEvento(req, res) {
    try {
      const evento = await Evento.findById(req.params.id);
      if (!evento) return res.status(404).json({ error: 'Evento no encontrado' });
      res.json(evento);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener evento', detalle: error.message });
    }
  }

  static async actualizar(req, res) {
    try {
      const evento = await Evento.update(req.params.id, req.body);
      res.json(evento);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar evento', detalle: error.message });
    }
  }

  static async eliminar(req, res) {
    try {
      const evento = await Evento.delete(req.params.id);
      res.json(evento);
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar evento', detalle: error.message });
    }
  }

  static async getAttendees(req, res) {
    try {
      const asistentes = await Evento.getAttendees(req.params.id);
      res.json(asistentes);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener asistentes', detalle: error.message });
    }
  }

  static async registrar(req, res) {
    try {
      const { id_mascota } = req.body;
      const asistencia = await AsistenciaEvento.create({
        id_evento: req.params.id,
        id_usuario: req.usuario.id,
        id_mascota
      });
      res.status(201).json(asistencia);
    } catch (error) {
      res.status(500).json({ error: 'Error al registrar asistencia', detalle: error.message });
    }
  }

  static async desregistrar(req, res) {
    try {
      const asistencia = await AsistenciaEvento.eliminar({
        id_evento: req.params.id,
        id_usuario: req.usuario.id
      });
      res.json(asistencia);
    } catch (error) {
      res.status(500).json({ error: 'Error al desregistrar asistencia', detalle: error.message });
    }
  }
}

module.exports = ControladorEventos; 
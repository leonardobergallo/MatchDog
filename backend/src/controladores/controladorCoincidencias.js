const CoincidenciaMascota = require('../modelos/CoincidenciaMascota');

class ControladorCoincidencias {
  static async crear(req, res) {
    try {
      const { id_mascota_1, id_mascota_2 } = req.body;
      const coincidencia = await CoincidenciaMascota.crear({ id_mascota_1, id_mascota_2 });
      res.status(201).json(coincidencia);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear coincidencia', detalle: error.message });
    }
  }

  static async actualizarEstado(req, res) {
    try {
      const { id } = req.params;
      const { estado } = req.body;
      const coincidencia = await CoincidenciaMascota.actualizarEstado(id, estado);
      res.json(coincidencia);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar estado', detalle: error.message });
    }
  }

  static async obtenerPorMascota(req, res) {
    try {
      const { id_mascota } = req.params;
      const coincidencias = await CoincidenciaMascota.obtenerPorMascota(id_mascota);
      res.json(coincidencias);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener coincidencias', detalle: error.message });
    }
  }

  static async obtenerPendientes(req, res) {
    try {
      const { id_mascota } = req.params;
      const coincidencias = await CoincidenciaMascota.obtenerPendientes(id_mascota);
      res.json(coincidencias);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener coincidencias pendientes', detalle: error.message });
    }
  }
}

module.exports = ControladorCoincidencias; 
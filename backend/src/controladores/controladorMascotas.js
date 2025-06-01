const Mascota = require('../modelos/Mascota');

class ControladorMascotas {
  static async crear(req, res) {
    try {
      const nuevaMascota = await Mascota.create({
        id_usuario: req.usuario.id,
        ...req.body
      });
      res.status(201).json(nuevaMascota);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear mascota', detalle: error.message });
    }
  }

  static async obtenerMascotasUsuario(req, res) {
    try {
      const mascotas = await Mascota.findByUserId(req.usuario.id);
      res.json(mascotas);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener mascotas', detalle: error.message });
    }
  }

  static async obtenerMascota(req, res) {
    try {
      const mascota = await Mascota.findById(req.params.id);
      if (!mascota) return res.status(404).json({ error: 'Mascota no encontrada' });
      res.json(mascota);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener mascota', detalle: error.message });
    }
  }

  static async actualizar(req, res) {
    try {
      const mascota = await Mascota.update(req.params.id, req.body);
      res.json(mascota);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar mascota', detalle: error.message });
    }
  }

  static async eliminar(req, res) {
    try {
      const mascota = await Mascota.delete(req.params.id);
      res.json(mascota);
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar mascota', detalle: error.message });
    }
  }
}

module.exports = ControladorMascotas; 
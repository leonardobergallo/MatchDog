const Mascota = require('../modelos/Mascota');

class ControladorSwipe {
  static async obtenerCandidatas(req, res) {
    try {
      const { id_mascota } = req.params;
      const candidatas = await Mascota.obtenerCandidatasParaSwipe(id_mascota);
      res.json(candidatas);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener candidatas', detalle: error.message });
    }
  }
}

module.exports = ControladorSwipe; 
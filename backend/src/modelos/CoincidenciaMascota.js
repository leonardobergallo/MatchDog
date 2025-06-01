const db = require('../configuracion/database');

class CoincidenciaMascota {
  static async crear({ id_mascota_1, id_mascota_2 }) {
    const query = `
      INSERT INTO coincidencias_mascotas (id_mascota_1, id_mascota_2)
      VALUES ($1, $2)
      RETURNING *
    `;
    const { rows } = await db.consulta(query, [id_mascota_1, id_mascota_2]);
    return rows[0];
  }

  static async actualizarEstado(id, estado) {
    const query = `
      UPDATE coincidencias_mascotas
      SET estado = $1
      WHERE id = $2
      RETURNING *
    `;
    const { rows } = await db.consulta(query, [estado, id]);
    return rows[0];
  }

  static async obtenerPorMascota(id_mascota) {
    const query = `
      SELECT * FROM coincidencias_mascotas
      WHERE id_mascota_1 = $1 OR id_mascota_2 = $1
      ORDER BY created_at DESC
    `;
    const { rows } = await db.consulta(query, [id_mascota]);
    return rows;
  }

  static async obtenerPendientes(id_mascota) {
    const query = `
      SELECT * FROM coincidencias_mascotas
      WHERE (id_mascota_1 = $1 OR id_mascota_2 = $1)
      AND estado = 'pendiente'
    `;
    const { rows } = await db.consulta(query, [id_mascota]);
    return rows;
  }
}

module.exports = CoincidenciaMascota; 
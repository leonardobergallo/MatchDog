const db = require('../configuracion/database');

class AsistenciaEvento {
  static async create({ id_evento, id_usuario, id_mascota }) {
    try {
      const query = `
        INSERT INTO asistencias_eventos (id_evento, id_usuario, id_mascota)
        VALUES ($1, $2, $3)
        RETURNING *
      `;
      const { rows } = await db.consulta(query, [id_evento, id_usuario, id_mascota]);
      return rows[0];
    } catch (error) {
      console.error('Error al crear asistencia:', error);
      throw error;
    }
  }

  static async estaRegistrado({ id_evento, id_usuario }) {
    try {
      const query = `
        SELECT EXISTS (
          SELECT 1 FROM asistencias_eventos
          WHERE id_evento = $1 AND id_usuario = $2
        ) as esta_registrado
      `;
      const { rows } = await db.consulta(query, [id_evento, id_usuario]);
      return rows[0].esta_registrado;
    } catch (error) {
      console.error('Error al verificar asistencia:', error);
      throw error;
    }
  }

  static async obtenerAsistenciaEvento(id_evento) {
    try {
      const query = `
        SELECT ae.*, 
               u.nombre as nombre_usuario,
               u.foto_url as foto_usuario,
               m.nombre as nombre_mascota,
               m.foto_url as foto_mascota
        FROM asistencias_eventos ae
        JOIN usuarios u ON ae.id_usuario = u.id
        JOIN mascotas m ON ae.id_mascota = m.id
        WHERE ae.id_evento = $1
        ORDER BY ae.created_at DESC
      `;
      const { rows } = await db.consulta(query, [id_evento]);
      return rows;
    } catch (error) {
      console.error('Error al obtener asistentes:', error);
      throw error;
    }
  }

  static async eliminar({ id_evento, id_usuario }) {
    try {
      const query = `
        DELETE FROM asistencias_eventos
        WHERE id_evento = $1 AND id_usuario = $2
        RETURNING id
      `;
      const { rows } = await db.consulta(query, [id_evento, id_usuario]);
      return rows[0];
    } catch (error) {
      console.error('Error al eliminar asistencia:', error);
      throw error;
    }
  }

  static async obtenerEventosUsuario(id_usuario) {
    try {
      const query = `
        SELECT e.*, 
               ae.created_at as fecha_registro,
               m.id as id_mascota,
               m.nombre as nombre_mascota
        FROM eventos e
        JOIN asistencias_eventos ae ON e.id = ae.id_evento
        JOIN mascotas m ON ae.id_mascota = m.id
        WHERE ae.id_usuario = $1
        ORDER BY e.fecha_hora DESC
      `;
      const { rows } = await db.consulta(query, [id_usuario]);
      return rows;
    } catch (error) {
      console.error('Error al obtener eventos del usuario:', error);
      throw error;
    }
  }
}

module.exports = AsistenciaEvento; 
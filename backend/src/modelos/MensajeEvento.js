const db = require('../configuracion/database');

class MensajeEvento {
  static async create({ id_evento, id_remitente, mensaje }) {
    try {
      const query = `
        INSERT INTO mensajes_eventos (id_evento, id_remitente, mensaje)
        VALUES ($1, $2, $3)
        RETURNING *
      `;
      const { rows } = await db.consulta(query, [id_evento, id_remitente, mensaje]);
      return rows[0];
    } catch (error) {
      console.error('Error al crear mensaje:', error);
      throw error;
    }
  }

  static async getEventMessages(id_evento, limite = 50, offset = 0) {
    try {
      const query = `
        SELECT m.*,
               u.nombre as nombre_remitente,
               u.foto_url as foto_remitente
        FROM mensajes_eventos m
        JOIN usuarios u ON m.id_remitente = u.id
        WHERE m.id_evento = $1
        ORDER BY m.created_at DESC
        LIMIT $2 OFFSET $3
      `;
      const { rows } = await db.consulta(query, [id_evento, limite, offset]);
      return rows.reverse();
    } catch (error) {
      console.error('Error al obtener mensajes:', error);
      throw error;
    }
  }

  static async delete(id_mensaje, id_remitente) {
    try {
      const query = `
        DELETE FROM mensajes_eventos
        WHERE id = $1 AND id_remitente = $2
        RETURNING id
      `;
      const { rows } = await db.consulta(query, [id_mensaje, id_remitente]);
      return rows[0];
    } catch (error) {
      console.error('Error al eliminar mensaje:', error);
      throw error;
    }
  }

  static async getUnreadCount(id_evento, id_usuario, ultima_lectura) {
    try {
      const query = `
        SELECT COUNT(*) as conteo
        FROM mensajes_eventos
        WHERE id_evento = $1
        AND id_remitente != $2
        AND created_at > $3
      `;
      const { rows } = await db.consulta(query, [id_evento, id_usuario, ultima_lectura]);
      return parseInt(rows[0].conteo);
    } catch (error) {
      console.error('Error al obtener conteo de mensajes no leídos:', error);
      throw error;
    }
  }
}

module.exports = MensajeEvento; 
const db = require('../configuracion/database');

class Evento {
  static async create({
    id_organizador,
    titulo,
    descripcion,
    tipo,
    fecha_hora,
    nombre_ubicacion,
    latitud,
    longitud,
    reglas,
    imagen_url
  }) {
    try {
      const query = `
        INSERT INTO eventos (
          id_organizador, titulo, descripcion, tipo, fecha_hora,
          nombre_ubicacion, latitud, longitud, reglas, imagen_url
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `;
      const { rows } = await db.consulta(query, [
        id_organizador,
        titulo,
        descripcion,
        tipo,
        fecha_hora,
        nombre_ubicacion,
        latitud,
        longitud,
        reglas,
        imagen_url
      ]);
      return rows[0];
    } catch (error) {
      console.error('Error al crear evento:', error);
      throw error;
    }
  }

  static async findNearby(latitud, longitud, radio) {
    try {
      const query = `
        SELECT *,
          (6371 * acos(
            cos(radians($1)) * cos(radians(latitud)) *
            cos(radians(longitud) - radians($2)) +
            sin(radians($1)) * sin(radians(latitud))
          )) AS distancia
        FROM eventos
        WHERE fecha_hora > NOW()
        HAVING distancia < $3
        ORDER BY distancia
      `;
      const { rows } = await db.consulta(query, [latitud, longitud, radio]);
      return rows;
    } catch (error) {
      console.error('Error al buscar eventos cercanos:', error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      const query = 'SELECT * FROM eventos WHERE id = $1';
      const { rows } = await db.consulta(query, [id]);
      return rows[0];
    } catch (error) {
      console.error('Error al buscar evento por ID:', error);
      throw error;
    }
  }

  static async update(id, {
    titulo,
    descripcion,
    tipo,
    fecha_hora,
    nombre_ubicacion,
    latitud,
    longitud,
    reglas,
    imagen_url
  }) {
    try {
      const query = `
        UPDATE eventos
        SET titulo = COALESCE($1, titulo),
            descripcion = COALESCE($2, descripcion),
            tipo = COALESCE($3, tipo),
            fecha_hora = COALESCE($4, fecha_hora),
            nombre_ubicacion = COALESCE($5, nombre_ubicacion),
            latitud = COALESCE($6, latitud),
            longitud = COALESCE($7, longitud),
            reglas = COALESCE($8, reglas),
            imagen_url = COALESCE($9, imagen_url),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $10
        RETURNING *
      `;
      const { rows } = await db.consulta(query, [
        titulo,
        descripcion,
        tipo,
        fecha_hora,
        nombre_ubicacion,
        latitud,
        longitud,
        reglas,
        imagen_url,
        id
      ]);
      return rows[0];
    } catch (error) {
      console.error('Error al actualizar evento:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const query = 'DELETE FROM eventos WHERE id = $1 RETURNING id';
      const { rows } = await db.consulta(query, [id]);
      return rows[0];
    } catch (error) {
      console.error('Error al eliminar evento:', error);
      throw error;
    }
  }

  static async getAttendees(id_evento) {
    try {
      const query = `
        SELECT u.id, u.nombre, u.foto_url, m.id as id_mascota, m.nombre as nombre_mascota, m.foto_url as foto_mascota
        FROM asistencias_eventos ae
        JOIN usuarios u ON ae.id_usuario = u.id
        JOIN mascotas m ON ae.id_mascota = m.id
        WHERE ae.id_evento = $1
      `;
      const { rows } = await db.consulta(query, [id_evento]);
      return rows;
    } catch (error) {
      console.error('Error al obtener asistentes:', error);
      throw error;
    }
  }
}

module.exports = Evento; 
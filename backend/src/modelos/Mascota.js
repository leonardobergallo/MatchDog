const db = require('../configuracion/database');

class Mascota {
  static async create({ id_usuario, nombre, especie, raza, edad, temperamento, foto_url }) {
    try {
      const query = `
        INSERT INTO mascotas (id_usuario, nombre, especie, raza, edad, temperamento, foto_url)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `;
      const { rows } = await db.consulta(query, [
        id_usuario,
        nombre,
        especie,
        raza,
        edad,
        temperamento,
        foto_url
      ]);
      return rows[0];
    } catch (error) {
      console.error('Error al crear mascota:', error);
      throw error;
    }
  }

  static async findByUserId(id_usuario) {
    try {
      const query = 'SELECT * FROM mascotas WHERE id_usuario = $1 ORDER BY created_at DESC';
      const { rows } = await db.consulta(query, [id_usuario]);
      return rows;
    } catch (error) {
      console.error('Error al buscar mascotas del usuario:', error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      const query = 'SELECT * FROM mascotas WHERE id = $1';
      const { rows } = await db.consulta(query, [id]);
      return rows[0];
    } catch (error) {
      console.error('Error al buscar mascota por ID:', error);
      throw error;
    }
  }

  static async update(id, { nombre, especie, raza, edad, temperamento, foto_url }) {
    try {
      const query = `
        UPDATE mascotas
        SET nombre = COALESCE($1, nombre),
            especie = COALESCE($2, especie),
            raza = COALESCE($3, raza),
            edad = COALESCE($4, edad),
            temperamento = COALESCE($5, temperamento),
            foto_url = COALESCE($6, foto_url),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $7
        RETURNING *
      `;
      const { rows } = await db.consulta(query, [
        nombre,
        especie,
        raza,
        edad,
        temperamento,
        foto_url,
        id
      ]);
      return rows[0];
    } catch (error) {
      console.error('Error al actualizar mascota:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const query = 'DELETE FROM mascotas WHERE id = $1 RETURNING id';
      const { rows } = await db.consulta(query, [id]);
      return rows[0];
    } catch (error) {
      console.error('Error al eliminar mascota:', error);
      throw error;
    }
  }

  static async obtenerCandidatasParaSwipe(id_mascota, filtros = {}) {
    let query = `
      SELECT m.*
      FROM mascotas m
      WHERE m.id != $1
        AND m.busca_pareja = TRUE
        AND m.id NOT IN (
          SELECT CASE
            WHEN id_mascota_1 = $1 THEN id_mascota_2
            ELSE id_mascota_1
          END
          FROM coincidencias_mascotas
          WHERE id_mascota_1 = $1 OR id_mascota_2 = $1
        )
    `;
    const params = [id_mascota];
    // Aquí puedes agregar más filtros (raza, edad, etc.)
    const { rows } = await db.consulta(query, params);
    return rows;
  }
}

module.exports = Mascota; 
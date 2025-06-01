const bcrypt = require('bcryptjs');
const db = require('../configuracion/database');

class Usuario {
  static async create({ nombre, email, contraseña, foto_url, ubicacion }) {
    try {
      const salt = await bcrypt.genSalt(10);
      const contraseñaEncriptada = await bcrypt.hash(contraseña, salt);
      const query = `
        INSERT INTO usuarios (nombre, email, contraseña, foto_url, ubicacion)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, nombre, email, foto_url, ubicacion, created_at
      `;
      const { rows } = await db.consulta(query, [
        nombre,
        email,
        contraseñaEncriptada,
        foto_url,
        ubicacion
      ]);
      return rows[0];
    } catch (error) {
      console.error('Error al crear usuario:', error);
      throw error;
    }
  }

  static async findByEmail(email) {
    try {
      const query = 'SELECT * FROM usuarios WHERE email = $1';
      const { rows } = await db.consulta(query, [email]);
      return rows[0];
    } catch (error) {
      console.error('Error al buscar usuario por email:', error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      const query = 'SELECT * FROM usuarios WHERE id = $1';
      const { rows } = await db.consulta(query, [id]);
      return rows[0];
    } catch (error) {
      console.error('Error al buscar usuario por ID:', error);
      throw error;
    }
  }

  static async verifyPassword(usuario, contraseña) {
    try {
      return await bcrypt.compare(contraseña, usuario.contraseña);
    } catch (error) {
      console.error('Error al verificar contraseña:', error);
      throw error;
    }
  }

  static async update(id, { nombre, email, foto_url, ubicacion }) {
    try {
      const query = `
        UPDATE usuarios
        SET nombre = COALESCE($1, nombre),
            email = COALESCE($2, email),
            foto_url = COALESCE($3, foto_url),
            ubicacion = COALESCE($4, ubicacion),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $5
        RETURNING id, nombre, email, foto_url, ubicacion, created_at, updated_at
      `;
      const { rows } = await db.consulta(query, [
        nombre,
        email,
        foto_url,
        ubicacion,
        id
      ]);
      return rows[0];
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const query = 'DELETE FROM usuarios WHERE id = $1 RETURNING id';
      const { rows } = await db.consulta(query, [id]);
      return rows[0];
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      throw error;
    }
  }
}

module.exports = Usuario; 
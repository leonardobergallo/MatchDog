const fs = require('fs');
const path = require('path');
const pool = require('./database');

async function inicializarBaseDatos() {
  try {
    // Leer el archivo SQL
    const sqlScript = fs.readFileSync(
      path.join(__dirname, 'init.sql'),
      'utf8'
    );

    // Ejecutar el script SQL
    await pool.query(sqlScript);
    console.log('✅ Base de datos inicializada correctamente');
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
    process.exit(1);
  } finally {
    // Cerrar la conexión
    await pool.end();
  }
}

// Ejecutar la inicialización
inicializarBaseDatos(); 
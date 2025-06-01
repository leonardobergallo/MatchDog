const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://DogSocial_owner:npg_lusRkc8CAz6Y@ep-round-frost-a82hdz6p.eastus2.azure.neon.tech/DogSocial?sslmode=require',
  ssl: {
    rejectUnauthorized: false // Necesario para conexiones SSL con Neon
  }
});

// Método personalizado para consultas
pool.consulta = async (texto, params) => {
  const inicio = Date.now();
  try {
    const resultado = await pool.query(texto, params);
    const duracion = Date.now() - inicio;
    console.log('Consulta ejecutada', { texto, duracion, filas: resultado.rowCount });
    return resultado;
  } catch (error) {
    console.error('Error en consulta:', error);
    throw error;
  }
};

// Probar la conexión
pool.connect((error, cliente, liberar) => {
  if (error) {
    console.error('Error al conectar con la base de datos:', error);
    return;
  }
  console.log('✅ Conexión exitosa a la base de datos PostgreSQL');
  liberar();
});

module.exports = pool; 
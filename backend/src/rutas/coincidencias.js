const express = require('express');
const router = express.Router();
const ControladorCoincidencias = require('../controladores/controladorCoincidencias');
const autenticacion = require('../intermediarios/autenticacion');

// Todas las rutas requieren autenticación
router.use(autenticacion);

// Crear coincidencia (me gusta)
router.post('/', ControladorCoincidencias.crear);

// Actualizar estado (aceptar/rechazar)
router.put('/:id', ControladorCoincidencias.actualizarEstado);

// Obtener coincidencias de una mascota
router.get('/mascota/:id_mascota', ControladorCoincidencias.obtenerPorMascota);

// Obtener coincidencias pendientes de una mascota
router.get('/mascota/:id_mascota/pendientes', ControladorCoincidencias.obtenerPendientes);

module.exports = router; 
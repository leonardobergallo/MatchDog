const express = require('express');
const router = express.Router();
const ControladorEventos = require('../controladores/controladorEventos');
const autenticacion = require('../intermediarios/autenticacion');

// Rutas públicas
router.get('/cercanos', ControladorEventos.obtenerEventosCercanos);
router.get('/:id', ControladorEventos.obtenerEvento);

// Rutas protegidas
router.use(autenticacion);

// Rutas de eventos
router.post('/', ControladorEventos.crear);
router.put('/:id', ControladorEventos.actualizar);
router.delete('/:id', ControladorEventos.eliminar);

// Rutas de asistencia
router.post('/:id/registrar', ControladorEventos.registrar);
router.delete('/:id/desregistrar', ControladorEventos.desregistrar);

module.exports = router; 
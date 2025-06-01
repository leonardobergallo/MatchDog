const express = require('express');
const router = express.Router();
const ControladorSwipe = require('../controladores/controladorSwipe');
const autenticacion = require('../intermediarios/autenticacion');

router.use(autenticacion);

// Obtener candidatas para swipe
router.get('/:id_mascota', ControladorSwipe.obtenerCandidatas);

module.exports = router; 
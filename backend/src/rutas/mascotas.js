const express = require('express');
const router = express.Router();
const ControladorMascotas = require('../controladores/controladorMascotas');
const autenticacion = require('../intermediarios/autenticacion');
const validarMascota = require('../intermediarios/validarMascota');

// Todas las rutas requieren autenticación
router.use(autenticacion);

// Rutas de mascotas
router.post('/', validarMascota, ControladorMascotas.crear);
router.get('/', ControladorMascotas.obtenerMascotasUsuario);
router.get('/:id', ControladorMascotas.obtenerMascota);
router.put('/:id', validarMascota, ControladorMascotas.actualizar);
router.delete('/:id', ControladorMascotas.eliminar);

module.exports = router; 
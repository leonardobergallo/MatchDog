const express = require('express');
const router = express.Router();
const ControladorAutenticacion = require('../controladores/controladorAutenticacion');
const autenticacion = require('../intermediarios/autenticacion');

// Rutas públicas
router.post('/registro', ControladorAutenticacion.registro);
router.post('/inicio-sesion', ControladorAutenticacion.inicioSesion);

// Rutas protegidas
router.get('/perfil', autenticacion, ControladorAutenticacion.obtenerPerfil);

module.exports = router; 
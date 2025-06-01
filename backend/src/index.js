require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

// Importar rutas
const rutasAutenticacion = require('./rutas/autenticacion');
const rutasMascotas = require('./rutas/mascotas');
const rutasEventos = require('./rutas/eventos');
const rutasSwipe = require('./rutas/swipe');
const rutasCoincidencias = require('./rutas/coincidencias');

const app = express();
const servidor = http.createServer(app);

// Configuración de Socket.IO
const io = socketIo(servidor, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Hacer io accesible en las rutas
app.set('io', io);

// Rutas
app.use('/api/auth', rutasAutenticacion);
app.use('/api/pets', rutasMascotas);
app.use('/api/events', rutasEventos);
app.use('/api/swipe', rutasSwipe);
app.use('/api/coincidencias', rutasCoincidencias);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ mensaje: '¡Bienvenido a la API de DogSocial! 🐕' });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('Error en el servidor:', err.stack);
  res.status(500).json({ error: '¡Algo salió mal!' });
});

// Configuración de Socket.IO para chat en tiempo real
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');

  socket.on('joinEvent', (eventId) => {
    socket.join(`evento_${eventId}`);
  });

  socket.on('leaveEvent', (eventId) => {
    socket.leave(`evento_${eventId}`);
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

const PUERTO = process.env.PORT || 3000;
servidor.listen(PUERTO, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PUERTO}`);
}); 
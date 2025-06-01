const rutasCoincidencias = require('./rutas/coincidencias');
const rutasSwipe = require('./rutas/swipe');

app.use('/api/matches', rutasCoincidencias);
app.use('/api/swipe', rutasSwipe); 
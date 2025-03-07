const express = require('express');
const eventRoutes = require('./eventRoutes');
const bookingRoutes = require('./bookingRoutes');

const router = express.Router();

// Rutas principales
router.use('/events', eventRoutes);
router.use('/bookings', bookingRoutes);

// Ruta de estado de la API
router.get('/status', (req, res) => {
  res.json({
    status: 'online',
    message: 'API funcionando correctamente',
    timestamp: new Date()
  });
});

module.exports = router;
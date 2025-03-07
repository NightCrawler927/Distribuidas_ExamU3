// src/index.js
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const routes = require('./routes');
const swaggerConfig = require('./config/swagger');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Documentación de la API
app.use('/api-docs', swaggerConfig.serve, swaggerConfig.setup);

// Rutas
app.use('/api', routes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenido a la API del Sistema de Inventario de Libros' });
});

// Iniciar servidor
const startServer = async () => {
  try {
    // Verificar conexión a la base de datos
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
      console.log(`Documentación disponible en http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
  }
};

startServer();

// Manejar cierre del servidor
process.on('SIGINT', async () => {
  try {
    await sequelize.close();
    console.log('Conexión a la base de datos cerrada.');
    process.exit(0);
  } catch (error) {
    console.error('Error al cerrar la conexión a la base de datos:', error);
    process.exit(1);
  }
});

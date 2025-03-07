// src/config/swagger.js
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Sistema de reserva_evento_barahona',
      version: '1.0.0',
      description: 'API para gestionar un reserva_evento_barahona, autores y géneros'
    },
    servers: [
      {
        url: 'http://localhost:3000/',
        description: 'Servidor de desarrollo'
      }
    ]
  },
  apis: [path.join(__dirname, '../routes/*.js')]
};

const specs = swaggerJsdoc(options);

module.exports = {
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(specs)
};

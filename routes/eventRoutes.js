const express = require('express');
const eventController = require('../controllers/eventController');
const { eventValidations } = require('../middlewares/validations');

const router = express.Router();

/**
 * @swagger
 * /api/events:
 *   post:
 *     summary: Crear un nuevo evento
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       201:
 *         description: Evento creado exitosamente
 */
router.post('/', eventValidations.create, eventController.createEvent);

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Obtener todos los eventos
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Nombre del evento (búsqueda parcial)
 *       - in: query
 *         name: dateFrom
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha inicial para filtrar eventos
 *       - in: query
 *         name: dateTo
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha final para filtrar eventos
 *     responses:
 *       200:
 *         description: Lista de eventos obtenida exitosamente
 */
router.get('/', eventController.getAllEvents);

/**
 * @swagger
 * /api/events/{id}:
 *   get:
 *     summary: Obtener un evento por su ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del evento
 *       - in: query
 *         name: includeBookings
 *         schema:
 *           type: boolean
 *         description: Incluir las reservas del evento
 *     responses:
 *       200:
 *         description: Evento obtenido exitosamente
 *       404:
 *         description: Evento no encontrado
 */
router.get('/:id', eventValidations.getById, eventController.getEventById);

/**
 * @swagger
 * /api/events/{id}:
 *   put:
 *     summary: Actualizar un evento existente
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del evento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       200:
 *         description: Evento actualizado exitosamente
 *       404:
 *         description: Evento no encontrado
 */
router.put('/:id', eventValidations.update, eventController.updateEvent);

/**
 * @swagger
 * /api/events/{id}:
 *   delete:
 *     summary: Eliminar un evento
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del evento
 *     responses:
 *       200:
 *         description: Evento eliminado exitosamente
 *       404:
 *         description: Evento no encontrado
 */
router.delete('/:id', eventValidations.delete, eventController.deleteEvent);

/**
 * @swagger
 * /api/events/{id}/availability:
 *   get:
 *     summary: Verificar disponibilidad de tickets para un evento
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del evento
 *       - in: query
 *         name: tickets
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Número de tickets a verificar
 *     responses:
 *       200:
 *         description: Disponibilidad verificada exitosamente
 *       404:
 *         description: Evento no encontrado
 */
router.get('/:id/availability', eventValidations.checkAvailability, eventController.checkAvailability);

module.exports = router;
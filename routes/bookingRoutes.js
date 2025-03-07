const express = require('express');
const bookingController = require('../controllers/bookingController');
const { bookingValidations } = require('../middlewares/validations');

const router = express.Router();

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Crear una nueva reserva
 *     tags: [Bookings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Booking'
 *     responses:
 *       201:
 *         description: Reserva creada exitosamente
 *       400:
 *         description: No hay suficientes tickets disponibles
 */
router.post('/', bookingValidations.create, bookingController.createBooking);

/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: Obtener todas las reservas
 *     tags: [Bookings]
 *     parameters:
 *       - in: query
 *         name: user_email
 *         schema:
 *           type: string
 *         description: Email del usuario para filtrar reservas
 *       - in: query
 *         name: event_id
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del evento para filtrar reservas
 *     responses:
 *       200:
 *         description: Lista de reservas obtenida exitosamente
 */
router.get('/', bookingController.getAllBookings);

/**
 * @swagger
 * /api/bookings/{id}:
 *   get:
 *     summary: Obtener una reserva por su ID
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la reserva
 *     responses:
 *       200:
 *         description: Reserva obtenida exitosamente
 *       404:
 *         description: Reserva no encontrada
 */
router.get('/:id', bookingValidations.getById, bookingController.getBookingById);

/**
 * @swagger
 * /api/bookings/event/{eventId}:
 *   get:
 *     summary: Obtener todas las reservas de un evento específico
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del evento
 *     responses:
 *       200:
 *         description: Lista de reservas obtenida exitosamente
 */
router.get('/event/:eventId', bookingValidations.getByEventId, bookingController.getBookingsByEventId);

/**
 * @swagger
 * /api/bookings/{id}:
 *   put:
 *     summary: Actualizar una reserva existente
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la reserva
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Booking'
 *     responses:
 *       200:
 *         description: Reserva actualizada exitosamente
 *       400:
 *         description: No hay suficientes tickets disponibles
 *       404:
 *         description: Reserva no encontrada
 */
router.put('/:id', bookingValidations.update, bookingController.updateBooking);

/**
 * @swagger
 * /api/bookings/{id}:
 *   delete:
 *     summary: Eliminar una reserva
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la reserva
 *     responses:
 *       200:
 *         description: Reserva eliminada exitosamente
 *       404:
 *         description: Reserva no encontrada
 */
router.delete('/:id', bookingValidations.delete, bookingController.deleteBooking);

module.exports = router;
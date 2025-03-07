const { Booking, Event } = require('../models');
const eventService = require('./eventService');

class BookingService {
  /**
   * Crear una nueva reserva
   * @param {Object} bookingData - Datos de la reserva
   * @returns {Promise<Object>} Reserva creada
   */
  async createBooking(bookingData) {
    try {
      // Verificar disponibilidad antes de crear la reserva
      const availability = await eventService.checkAvailability(
        bookingData.event_id,
        bookingData.num_tickets
      );
      
      if (!availability.available) {
        throw new Error('No hay suficientes tickets disponibles para este evento');
      }
      
      // Crear la reserva
      const booking = await Booking.create(bookingData);
      
      return {
        booking,
        availability
      };
    } catch (error) {
      console.error('Error al crear reserva:', error);
      throw error;
    }
  }

  /**
   * Obtener todas las reservas
   * @param {Object} filters - Filtros opcionales
   * @returns {Promise<Array>} Lista de reservas
   */
  async getAllBookings(filters = {}) {
    try {
      const whereConditions = {};
      
      // Aplicar filtros si existen
      if (filters.user_email) {
        whereConditions.user_email = filters.user_email;
      }
      
      if (filters.event_id) {
        whereConditions.event_id = filters.event_id;
      }

      const bookings = await Booking.findAll({
        where: whereConditions,
        include: [
          {
            model: Event,
            as: 'event'
          }
        ],
        order: [['created_at', 'DESC']]
      });
      
      return bookings;
    } catch (error) {
      console.error('Error al obtener reservas:', error);
      throw error;
    }
  }

  /**
   * Obtener una reserva por su ID
   * @param {string} id - ID de la reserva
   * @returns {Promise<Object>} Reserva encontrada
   */
  async getBookingById(id) {
    try {
      const booking = await Booking.findOne({
        where: { id },
        include: [
          {
            model: Event,
            as: 'event'
          }
        ]
      });
      
      if (!booking) {
        throw new Error('Reserva no encontrada');
      }
      
      return booking;
    } catch (error) {
      console.error(`Error al obtener reserva con ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Obtener todas las reservas de un evento específico
   * @param {string} eventId - ID del evento
   * @returns {Promise<Array>} Lista de reservas del evento
   */
  async getBookingsByEventId(eventId) {
    try {
      const bookings = await Booking.findAll({
        where: { event_id: eventId },
        order: [['created_at', 'DESC']]
      });
      
      return bookings;
    } catch (error) {
      console.error(`Error al obtener reservas para el evento ${eventId}:`, error);
      throw error;
    }
  }

  /**
   * Actualizar una reserva existente
   * @param {string} id - ID de la reserva a actualizar
   * @param {Object} bookingData - Nuevos datos de la reserva
   * @returns {Promise<Object>} Reserva actualizada
   */
  async updateBooking(id, bookingData) {
    try {
      const booking = await this.getBookingById(id);
      
      // Si se está actualizando el número de tickets, verificar disponibilidad
      if (bookingData.num_tickets && bookingData.num_tickets !== booking.num_tickets) {
        // Calcular la diferencia de tickets
        const ticketDifference = bookingData.num_tickets - booking.num_tickets;
        
        if (ticketDifference > 0) {
          // Si se están solicitando más tickets, verificar disponibilidad
          const availability = await eventService.checkAvailability(
            booking.event_id,
            ticketDifference
          );
          
          if (!availability.available) {
            throw new Error('No hay suficientes tickets disponibles para este evento');
          }
        }
      }
      
      // Actualizar la reserva
      await booking.update(bookingData);
      
      return booking;
    } catch (error) {
      console.error(`Error al actualizar reserva con ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Eliminar una reserva
   * @param {string} id - ID de la reserva a eliminar
   * @returns {Promise<boolean>} True si se eliminó correctamente
   */
  async deleteBooking(id) {
    try {
      const booking = await this.getBookingById(id);
      
      await booking.destroy();
      
      return true;
    } catch (error) {
      console.error(`Error al eliminar reserva con ID ${id}:`, error);
      throw error;
    }
  }
}

module.exports = new BookingService();
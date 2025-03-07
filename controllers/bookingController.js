const bookingService = require('../services/bookingService');

class BookingController {
  /**
   * Crear una nueva reserva
   */
  async createBooking(req, res) {
    try {
      const result = await bookingService.createBooking(req.body);
      
      return res.status(201).json({
        success: true,
        message: 'Reserva creada correctamente',
        data: result.booking,
        availability: result.availability
      });
    } catch (error) {
      console.error('Error en createBooking controller:', error);
      
      // Si el error es de disponibilidad
      if (error.message.includes('No hay suficientes tickets disponibles')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'Error al crear la reserva',
        error: error.message
      });
    }
  }

  /**
   * Obtener todas las reservas
   */
  async getAllBookings(req, res) {
    try {
      // Extraer los filtros de la query
      const { user_email, event_id } = req.query;
      const filters = { user_email, event_id };
      
      const bookings = await bookingService.getAllBookings(filters);
      
      return res.status(200).json({
        success: true,
        message: 'Reservas obtenidas correctamente',
        count: bookings.length,
        data: bookings
      });
    } catch (error) {
      console.error('Error en getAllBookings controller:', error);
      
      return res.status(500).json({
        success: false,
        message: 'Error al obtener las reservas',
        error: error.message
      });
    }
  }

  /**
   * Obtener una reserva por su ID
   */
  async getBookingById(req, res) {
    try {
      const { id } = req.params;
      
      const booking = await bookingService.getBookingById(id);
      
      return res.status(200).json({
        success: true,
        message: 'Reserva obtenida correctamente',
        data: booking
      });
    } catch (error) {
      console.error(`Error en getBookingById controller:`, error);
      
      // Si el error es que no se encontró la reserva
      if (error.message === 'Reserva no encontrada') {
        return res.status(404).json({
          success: false,
          message: 'Reserva no encontrada',
          error: error.message
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'Error al obtener la reserva',
        error: error.message
      });
    }
  }

  /**
   * Obtener todas las reservas de un evento específico
   */
  async getBookingsByEventId(req, res) {
    try {
      const { eventId } = req.params;
      
      const bookings = await bookingService.getBookingsByEventId(eventId);
      
      return res.status(200).json({
        success: true,
        message: 'Reservas obtenidas correctamente',
        count: bookings.length,
        data: bookings
      });
    } catch (error) {
      console.error(`Error en getBookingsByEventId controller:`, error);
      
      return res.status(500).json({
        success: false,
        message: 'Error al obtener las reservas del evento',
        error: error.message
      });
    }
  }

  /**
   * Actualizar una reserva existente
   */
  async updateBooking(req, res) {
    try {
      const { id } = req.params;
      
      const booking = await bookingService.updateBooking(id, req.body);
      
      return res.status(200).json({
        success: true,
        message: 'Reserva actualizada correctamente',
        data: booking
      });
    } catch (error) {
      console.error(`Error en updateBooking controller:`, error);
      
      // Si el error es que no se encontró la reserva
      if (error.message === 'Reserva no encontrada') {
        return res.status(404).json({
          success: false,
          message: 'Reserva no encontrada',
          error: error.message
        });
      }
      
      // Si el error es de disponibilidad
      if (error.message.includes('No hay suficientes tickets disponibles')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'Error al actualizar la reserva',
        error: error.message
      });
    }
  }

  /**
   * Eliminar una reserva
   */
  async deleteBooking(req, res) {
    try {
      const { id } = req.params;
      
      await bookingService.deleteBooking(id);
      
      return res.status(200).json({
        success: true,
        message: 'Reserva eliminada correctamente'
      });
    } catch (error) {
      console.error(`Error en deleteBooking controller:`, error);
      
      // Si el error es que no se encontró la reserva
      if (error.message === 'Reserva no encontrada') {
        return res.status(404).json({
          success: false,
          message: 'Reserva no encontrada',
          error: error.message
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'Error al eliminar la reserva',
        error: error.message
      });
    }
  }
}

module.exports = new BookingController();
const eventService = require('../services/eventService');

class EventController {
  /**
   * Crear un nuevo evento
   */
  async createEvent(req, res) {
    try {
      const event = await eventService.createEvent(req.body);
      
      return res.status(201).json({
        success: true,
        message: 'Evento creado correctamente',
        data: event
      });
    } catch (error) {
      console.error('Error en createEvent controller:', error);
      
      return res.status(500).json({
        success: false,
        message: 'Error al crear el evento',
        error: error.message
      });
    }
  }

  /**
   * Obtener todos los eventos
   */
  async getAllEvents(req, res) {
    try {
      // Extraer los filtros de la query
      const { name, dateFrom, dateTo } = req.query;
      const filters = { name, dateFrom, dateTo };
      
      const events = await eventService.getAllEvents(filters);
      
      return res.status(200).json({
        success: true,
        message: 'Eventos obtenidos correctamente',
        count: events.length,
        data: events
      });
    } catch (error) {
      console.error('Error en getAllEvents controller:', error);
      
      return res.status(500).json({
        success: false,
        message: 'Error al obtener los eventos',
        error: error.message
      });
    }
  }

  /**
   * Obtener un evento por su ID
   */
  async getEventById(req, res) {
    try {
      const { id } = req.params;
      const includeBookings = req.query.includeBookings === 'true';
      
      const event = await eventService.getEventById(id, includeBookings);
      
      return res.status(200).json({
        success: true,
        message: 'Evento obtenido correctamente',
        data: event
      });
    } catch (error) {
      console.error(`Error en getEventById controller:`, error);
      
      // Si el error es que no se encontró el evento
      if (error.message === 'Evento no encontrado') {
        return res.status(404).json({
          success: false,
          message: 'Evento no encontrado',
          error: error.message
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'Error al obtener el evento',
        error: error.message
      });
    }
  }

  /**
   * Actualizar un evento existente
   */
  async updateEvent(req, res) {
    try {
      const { id } = req.params;
      
      const event = await eventService.updateEvent(id, req.body);
      
      return res.status(200).json({
        success: true,
        message: 'Evento actualizado correctamente',
        data: event
      });
    } catch (error) {
      console.error(`Error en updateEvent controller:`, error);
      
      // Si el error es que no se encontró el evento
      if (error.message === 'Evento no encontrado') {
        return res.status(404).json({
          success: false,
          message: 'Evento no encontrado',
          error: error.message
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'Error al actualizar el evento',
        error: error.message
      });
    }
  }

  /**
   * Eliminar un evento
   */
  async deleteEvent(req, res) {
    try {
      const { id } = req.params;
      
      await eventService.deleteEvent(id);
      
      return res.status(200).json({
        success: true,
        message: 'Evento eliminado correctamente'
      });
    } catch (error) {
      console.error(`Error en deleteEvent controller:`, error);
      
      // Si el error es que no se encontró el evento
      if (error.message === 'Evento no encontrado') {
        return res.status(404).json({
          success: false,
          message: 'Evento no encontrado',
          error: error.message
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'Error al eliminar el evento',
        error: error.message
      });
    }
  }

  /**
   * Verificar disponibilidad de tickets para un evento
   */
  async checkAvailability(req, res) {
    try {
      const { id } = req.params;
      const { tickets } = req.query;
      
      const availability = await eventService.checkAvailability(id, parseInt(tickets) || 1);
      
      return res.status(200).json({
        success: true,
        message: 'Disponibilidad verificada correctamente',
        data: availability
      });
    } catch (error) {
      console.error(`Error en checkAvailability controller:`, error);
      
      // Si el error es que no se encontró el evento
      if (error.message === 'Evento no encontrado') {
        return res.status(404).json({
          success: false,
          message: 'Evento no encontrado',
          error: error.message
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'Error al verificar disponibilidad',
        error: error.message
      });
    }
  }
}

module.exports = new EventController();
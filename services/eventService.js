const { Event, Booking } = require('../models');
const { Op } = require('sequelize');

class EventService {
  /**
   * Crear un nuevo evento
   * @param {Object} eventData - Datos del evento a crear
   * @returns {Promise<Object>} Evento creado
   */
  async createEvent(eventData) {
    try {
      const event = await Event.create(eventData);
      return event;
    } catch (error) {
      console.error('Error al crear evento:', error);
      throw error;
    }
  }

  /**
   * Obtener todos los eventos
   * @param {Object} filters - Filtros opcionales (fecha, nombre, etc.)
   * @returns {Promise<Array>} Lista de eventos
   */
  async getAllEvents(filters = {}) {
    try {
      const whereConditions = {};
      
      // Aplicar filtros si existen
      if (filters.name) {
        whereConditions.name = { [Op.iLike]: `%${filters.name}%` };
      }
      
      if (filters.dateFrom && filters.dateTo) {
        whereConditions.date = {
          [Op.between]: [new Date(filters.dateFrom), new Date(filters.dateTo)]
        };
      } else if (filters.dateFrom) {
        whereConditions.date = { [Op.gte]: new Date(filters.dateFrom) };
      } else if (filters.dateTo) {
        whereConditions.date = { [Op.lte]: new Date(filters.dateTo) };
      }

      const events = await Event.findAll({
        where: whereConditions,
        order: [['date', 'ASC']]
      });
      
      return events;
    } catch (error) {
      console.error('Error al obtener eventos:', error);
      throw error;
    }
  }

  /**
   * Obtener un evento por su ID
   * @param {string} id - ID del evento
   * @param {boolean} includeBookings - Si se deben incluir las reservas
   * @returns {Promise<Object>} Evento encontrado
   */
  async getEventById(id, includeBookings = false) {
    try {
      const options = {
        where: { id }
      };

      if (includeBookings) {
        options.include = [
          {
            model: Booking,
            as: 'bookings'
          }
        ];
      }

      const event = await Event.findOne(options);
      
      if (!event) {
        throw new Error('Evento no encontrado');
      }
      
      return event;
    } catch (error) {
      console.error(`Error al obtener evento con ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Actualizar un evento existente
   * @param {string} id - ID del evento a actualizar
   * @param {Object} eventData - Nuevos datos del evento
   * @returns {Promise<Object>} Evento actualizado
   */
  async updateEvent(id, eventData) {
    try {
      const event = await this.getEventById(id);
      
      await event.update(eventData);
      
      return event;
    } catch (error) {
      console.error(`Error al actualizar evento con ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Eliminar un evento
   * @param {string} id - ID del evento a eliminar
   * @returns {Promise<boolean>} True si se eliminó correctamente
   */
  async deleteEvent(id) {
    try {
      const event = await this.getEventById(id);
      
      await event.destroy();
      
      return true;
    } catch (error) {
      console.error(`Error al eliminar evento con ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Verificar disponibilidad de tickets para un evento
   * @param {string} eventId - ID del evento
   * @param {number} requestedTickets - Número de tickets solicitados
   * @returns {Promise<boolean>} True si hay disponibilidad
   */
  async checkAvailability(eventId, requestedTickets) {
    try {
      const event = await this.getEventById(eventId);
      
      // Obtener el total de tickets ya reservados
      const bookedTickets = await Booking.sum('num_tickets', {
        where: { event_id: eventId }
      }) || 0;
      
      // Calcular disponibilidad
      const availableTickets = event.capacity - bookedTickets;
      
      return {
        available: availableTickets >= requestedTickets,
        eventCapacity: event.capacity,
        bookedTickets,
        availableTickets,
        requestedTickets
      };
    } catch (error) {
      console.error(`Error al verificar disponibilidad para evento ${eventId}:`, error);
      throw error;
    }
  }
}

module.exports = new EventService();
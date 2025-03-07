'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Primero obtener los IDs de eventos existentes
    const events = await queryInterface.sequelize.query(
      'SELECT id FROM events;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (events.length === 0) {
      console.log('No hay eventos para crear reservas de prueba.');
      return;
    }

    // Crear reservas de prueba para los eventos existentes
    const bookings = [];

    // Generar emails aleatorios
    const domains = ['gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com', 'empresa.com'];
    const names = ['juan', 'maria', 'pedro', 'ana', 'carlos', 'sofia', 'luis', 'laura', 'diego', 'valentina'];

    // Crear varias reservas para cada evento
    events.forEach(event => {
      // Número aleatorio de reservas por evento (entre 5 y 15)
      const numBookings = Math.floor(Math.random() * 11) + 5;

      for (let i = 0; i < numBookings; i++) {
        // Generar un email aleatorio
        const name = names[Math.floor(Math.random() * names.length)];
        const domain = domains[Math.floor(Math.random() * domains.length)];
        const email = `${name}${Math.floor(Math.random() * 1000)}@${domain}`;

        // Número aleatorio de tickets (entre 1 y 5)
        const numTickets = Math.floor(Math.random() * 5) + 1;

        bookings.push({
          id: uuidv4(),
          event_id: event.id,
          user_email: email,
          num_tickets: numTickets,
          created_at: new Date(),
          updated_at: new Date()
        });
      }
    });

    await queryInterface.bulkInsert('bookings', bookings);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('bookings', null, {});
  }
};
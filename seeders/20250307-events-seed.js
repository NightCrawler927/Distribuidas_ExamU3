'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Función auxiliar para crear fechas futuras
    const getFutureDate = (monthsAhead, day = null) => {
      const date = new Date();
      date.setMonth(date.getMonth() + monthsAhead);
      if (day !== null) {
        date.setDate(day);
      }
      return date;
    };

    // Crear eventos de ejemplo
    const events = [
      {
        id: uuidv4(),
        name: 'Conferencia de Desarrollo Web',
        description: 'Una conferencia sobre las últimas tendencias en desarrollo web, incluyendo JavaScript, React, Node.js y más.',
        date: getFutureDate(1), // Un mes en el futuro
        capacity: 100,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Workshop de Docker y Kubernetes',
        description: 'Un taller práctico sobre contenedores con Docker y orquestación con Kubernetes para desarrolladores y DevOps.',
        date: getFutureDate(2), // Dos meses en el futuro
        capacity: 50,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Hackathon de Innovación',
        description: 'Un hackathon de 48 horas para desarrollar soluciones innovadoras a problemas reales en la industria tecnológica.',
        date: getFutureDate(3), // Tres meses en el futuro
        capacity: 200,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Meetup de Inteligencia Artificial',
        description: 'Un encuentro para discutir los avances recientes en inteligencia artificial, machine learning y deep learning.',
        date: getFutureDate(1, 15), // Un mes en el futuro, día 15
        capacity: 75,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Curso Intensivo de PostgreSQL',
        description: 'Un curso intensivo de 3 días sobre PostgreSQL, desde conceptos básicos hasta técnicas avanzadas de optimización.',
        date: getFutureDate(2, 10), // Dos meses en el futuro, día 10
        capacity: 30,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await queryInterface.bulkInsert('events', events);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('events', null, {});
  }
};
'use strict';
const { Model } = require('sequelize');

/**
 * @swagger
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       required:
 *         - name
 *         - date
 *         - capacity
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID único del evento
 *         name:
 *           type: string
 *           description: Nombre del evento
 *         description:
 *           type: string
 *           description: Descripción detallada del evento
 *         date:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora del evento
 *         capacity:
 *           type: integer
 *           description: Capacidad máxima del evento
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación del registro
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización
 */
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    static associate(models) {
      // Define las relaciones aquí
      Event.hasMany(models.Booking, {
        foreignKey: 'event_id',
        as: 'bookings'
      });
    }
  }
  Event.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El nombre del evento no puede estar vacío'
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: {
          msg: 'La fecha debe ser válida'
        }
      }
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: [1],
          msg: 'La capacidad debe ser de al menos 1'
        }
      }
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Event',
    tableName: 'events',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Event;
};
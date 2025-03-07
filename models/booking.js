'use strict';
const { Model } = require('sequelize');

/**
 * @swagger
 * components:
 *   schemas:
 *     Booking:
 *       type: object
 *       required:
 *         - event_id
 *         - user_email
 *         - num_tickets
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID único de la reserva
 *         event_id:
 *           type: string
 *           format: uuid
 *           description: ID del evento asociado
 *         user_email:
 *           type: string
 *           format: email
 *           description: Email del usuario que hace la reserva
 *         num_tickets:
 *           type: integer
 *           description: Número de tickets reservados
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
  class Booking extends Model {
    static associate(models) {
      // Define las relaciones aquí
      Booking.belongsTo(models.Event, {
        foreignKey: 'event_id',
        as: 'event'
      });
    }
  }
  Booking.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    event_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'events',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    user_email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        isEmail: {
          msg: 'Debe proporcionar un email válido'
        }
      }
    },
    num_tickets: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: [1],
          msg: 'Debe reservar al menos un ticket'
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
    modelName: 'Booking',
    tableName: 'bookings',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Booking;
};
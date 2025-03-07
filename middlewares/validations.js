const { body, param, query, validationResult } = require('express-validator');

// Middleware para validar resultados
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
};

// Validaciones para eventos
const eventValidations = {
  create: [
    body('name')
      .notEmpty().withMessage('El nombre del evento es obligatorio')
      .isString().withMessage('El nombre debe ser un texto')
      .isLength({ max: 100 }).withMessage('El nombre no puede superar los 100 caracteres'),
    
    body('description')
      .optional()
      .isString().withMessage('La descripción debe ser un texto'),
    
    body('date')
      .notEmpty().withMessage('La fecha del evento es obligatoria')
      .isISO8601().withMessage('La fecha debe tener un formato válido (YYYY-MM-DD HH:MM:SS)')
      .custom(value => {
        const eventDate = new Date(value);
        const now = new Date();
        if (eventDate < now) {
          throw new Error('La fecha del evento no puede ser en el pasado');
        }
        return true;
      }),
    
    body('capacity')
      .notEmpty().withMessage('La capacidad del evento es obligatoria')
      .isInt({ min: 1 }).withMessage('La capacidad debe ser un número entero mayor a 0'),
    
    validate
  ],
  
  update: [
    param('id')
      .isUUID(4).withMessage('El ID del evento debe ser un UUID válido'),
    
    body('name')
      .optional()
      .isString().withMessage('El nombre debe ser un texto')
      .isLength({ max: 100 }).withMessage('El nombre no puede superar los 100 caracteres'),
    
    body('description')
      .optional()
      .isString().withMessage('La descripción debe ser un texto'),
    
    body('date')
      .optional()
      .isISO8601().withMessage('La fecha debe tener un formato válido (YYYY-MM-DD HH:MM:SS)')
      .custom(value => {
        const eventDate = new Date(value);
        const now = new Date();
        if (eventDate < now) {
          throw new Error('La fecha del evento no puede ser en el pasado');
        }
        return true;
      }),
    
    body('capacity')
      .optional()
      .isInt({ min: 1 }).withMessage('La capacidad debe ser un número entero mayor a 0'),
    
    validate
  ],
  
  getById: [
    param('id')
      .isUUID(4).withMessage('El ID del evento debe ser un UUID válido'),
    
    validate
  ],
  
  delete: [
    param('id')
      .isUUID(4).withMessage('El ID del evento debe ser un UUID válido'),
    
    validate
  ],
  
  checkAvailability: [
    param('id')
      .isUUID(4).withMessage('El ID del evento debe ser un UUID válido'),
    
    query('tickets')
      .optional()
      .isInt({ min: 1 }).withMessage('El número de tickets debe ser un número entero mayor a 0'),
    
    validate
  ]
};

// Validaciones para reservas
const bookingValidations = {
  create: [
    body('event_id')
      .notEmpty().withMessage('El ID del evento es obligatorio')
      .isUUID(4).withMessage('El ID del evento debe ser un UUID válido'),
    
    body('user_email')
      .notEmpty().withMessage('El email del usuario es obligatorio')
      .isEmail().withMessage('Debe proporcionar un email válido')
      .isLength({ max: 100 }).withMessage('El email no puede superar los 100 caracteres'),
    
    body('num_tickets')
      .notEmpty().withMessage('El número de tickets es obligatorio')
      .isInt({ min: 1 }).withMessage('El número de tickets debe ser un número entero mayor a 0'),
    
    validate
  ],
  
  update: [
    param('id')
      .isUUID(4).withMessage('El ID de la reserva debe ser un UUID válido'),
    
    body('event_id')
      .optional()
      .isUUID(4).withMessage('El ID del evento debe ser un UUID válido'),
    
    body('user_email')
      .optional()
      .isEmail().withMessage('Debe proporcionar un email válido')
      .isLength({ max: 100 }).withMessage('El email no puede superar los 100 caracteres'),
    
    body('num_tickets')
      .optional()
      .isInt({ min: 1 }).withMessage('El número de tickets debe ser un número entero mayor a 0'),
    
    validate
  ],
  
  getById: [
    param('id')
      .isUUID(4).withMessage('El ID de la reserva debe ser un UUID válido'),
    
    validate
  ],
  
  delete: [
    param('id')
      .isUUID(4).withMessage('El ID de la reserva debe ser un UUID válido'),
    
    validate
  ],
  
  getByEventId: [
    param('eventId')
      .isUUID(4).withMessage('El ID del evento debe ser un UUID válido'),
    
    validate
  ]
};

module.exports = {
  eventValidations,
  bookingValidations
};
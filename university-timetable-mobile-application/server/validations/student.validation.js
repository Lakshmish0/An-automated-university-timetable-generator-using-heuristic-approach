const Joi = require('joi');

// Timetable query validation schema
const timetableQuerySchema = Joi.object({
  semester: Joi.string().required()
    .messages({
      'any.required': 'Semester is required'
    }),
  academicYear: Joi.string().pattern(/^\d{4}-\d{4}$/).required()
    .messages({
      'string.pattern.base': 'Academic year must be in YYYY-YYYY format',
      'any.required': 'Academic year is required'
    }),
  department: Joi.string().required()
    .messages({
      'any.required': 'Department is required'
    })
});

// Appointment booking validation schema
const appointmentSchema = Joi.object({
  teacherId: Joi.string().required()
    .messages({
      'any.required': 'Teacher ID is required'
    }),
  date: Joi.date().min('now').required()
    .messages({
      'date.min': 'Appointment date must be in the future',
      'any.required': 'Appointment date is required'
    }),
  timeSlot: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required()
    .messages({
      'string.pattern.base': 'Time slot must be in HH:MM format',
      'any.required': 'Time slot is required'
    }),
  purpose: Joi.string().min(10).max(500).required()
    .messages({
      'string.min': 'Purpose must be at least 10 characters long',
      'string.max': 'Purpose cannot exceed 500 characters',
      'any.required': 'Purpose is required'
    }),
  duration: Joi.number().integer().min(15).max(120).required()
    .messages({
      'number.min': 'Duration must be at least 15 minutes',
      'number.max': 'Duration cannot exceed 120 minutes',
      'number.integer': 'Duration must be in whole minutes',
      'any.required': 'Duration is required'
    })
});

// Class schedule query validation schema
const classScheduleSchema = Joi.object({
  date: Joi.date().required()
    .messages({
      'any.required': 'Date is required'
    }),
  subject: Joi.string()
    .messages({
      'string.base': 'Subject must be a string'
    })
});

module.exports = {
  timetableQuerySchema,
  appointmentSchema,
  classScheduleSchema
};
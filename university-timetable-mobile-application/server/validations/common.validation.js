const Joi = require('joi');

// Profile update validation schema
const profileSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^[0-9]{10}$/).required(),
  department: Joi.string().required(),
  designation: Joi.string().required()
});

// Password change validation schema
const passwordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .required()
    .messages({
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
    }),
  confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required()
    .messages({
      'any.only': 'Passwords do not match'
    })
});

// Profile picture validation schema
const pictureSchema = Joi.object({
  picture: Joi.string().required()
});

module.exports = {
  profileSchema,
  passwordSchema,
  pictureSchema
};
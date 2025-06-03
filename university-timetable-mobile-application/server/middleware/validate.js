// middleware/validate.js
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body || req.query, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      error: error.details.map((detail) => detail.message),
    });
  }
  next();
};

module.exports = validate;

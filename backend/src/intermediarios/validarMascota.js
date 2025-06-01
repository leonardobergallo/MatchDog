const Joi = require('joi');

const esquemaMascota = Joi.object({
  nombre: Joi.string().min(2).max(50).required().messages({
    'string.empty': 'El nombre es obligatorio',
    'any.required': 'El nombre es obligatorio'
  }),
  especie: Joi.string().min(2).max(30).required().messages({
    'string.empty': 'La especie es obligatoria',
    'any.required': 'La especie es obligatoria'
  }),
  raza: Joi.string().min(2).max(30).required().messages({
    'string.empty': 'La raza es obligatoria',
    'any.required': 'La raza es obligatoria'
  }),
  edad: Joi.number().integer().min(0).max(50).required().messages({
    'number.base': 'La edad debe ser un número',
    'number.min': 'La edad debe ser mayor o igual a 0',
    'any.required': 'La edad es obligatoria'
  }),
  temperamento: Joi.string().max(50).allow('', null),
  foto_url: Joi.string().uri().allow('', null),
});

function validarMascota(req, res, next) {
  const { error } = esquemaMascota.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      error: true,
      mensaje: 'Datos inválidos',
      detalles: error.details.map(d => d.message)
    });
  }
  next();
}

module.exports = validarMascota; 
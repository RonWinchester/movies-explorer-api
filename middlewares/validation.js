const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const method = (value) => {
  const result = validator.isURL(value);
  if (result) {
    return value;
  }
  throw new Error('URL validation err');
};

module.exports.createUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(3),
  }),
});

module.exports.loginUserValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(3),
  }),
});

module.exports.editProfileValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().email(),
  }),
});

module.exports.paramsValidation = celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().length(24).hex(),
  }),
});

module.exports.createMovieValidator = celebrate({
  body: Joi.object().keys({
    country: Joi
      .string()
      .required(),
    director: Joi
      .string()
      .required(),
    duration: Joi
      .number()
      .required(),
    year: Joi
      .string()
      .required()
      .length(4),
    description: Joi
      .string()
      .required(),
    image: Joi
      .string()
      .required()
      .custom(method),
    trailer: Joi
      .string()
      .custom(method)
      .required(),
    thumbnail: Joi
      .string()
      .custom(method)
      .required(),
    movieId: Joi
      .number()
      .required(),
    nameRU: Joi
      .string()
      .required(),
    nameEN: Joi
      .string()
      .required(),
  }),
});

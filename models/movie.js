const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
    default: 'Страна',
  },
  director: {
    type: String,
    required: true,
    default: 'Режиссер',
  },
  duration: {
    type: Number,
    required: true,
    default: '20:21',
  },
  year: {
    type: String,
    required: true,
    default: '2021',
  },
  description: {
    type: String,
    required: true,
    default: 'Описание фильма',
  },
  image: {
    type: String,
    default:
      'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator(link) {
        return validator.isURL(link);
      },
    },
  },
  trailer: {
    type: String,
    default: 'https://yandex.ru',
    validate: {
      validator(link) {
        return validator.isURL(link);
      },
    },
  },
  thumbnail: {
    type: String,
    default:
      'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator(link) {
        return validator.isURL(link);
      },
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: String,
    required: true,
    default: 'id MoviesExplorer',
  },
  nameRU: {
    type: String,
    required: true,
    default: 'Название на русском',
  },
  nameEN: {
    type: String,
    required: true,
    default: 'Название на английском',
  },
});

module.exports = mongoose.model('movie', userSchema);

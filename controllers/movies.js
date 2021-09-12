const Movie = require('../models/movie');
const BadRequest = require('../errors/BadRequest');
const NotFoundError = require('../errors/NotFoundError');
const ConflictingRequest = require('../errors/ConflictingRequest');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .orFail(() => {
      throw new NotFoundError('Карточки не найдены');
    })
    .then((movies) => {
      res.send(movies);
    })
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  const owner = req.user._id;
  Movie.find({ movieId, owner })
    .then((savedMovie) => {
      if (savedMovie.length !== 0) {
        return next(new ConflictingRequest('Фильм уже сохранен'));
      }
      return Movie.create({
        country,
        director,
        duration,
        year,
        description,
        image,
        trailer,
        nameRU,
        nameEN,
        thumbnail,
        movieId,
        owner,
      })
        .then((movie) => res.status(200).send(movie))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            const error = new BadRequest('Переданы некорректные данные');
            return next(error);
          }
          return next(err);
        });
    })
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.id)
    .orFail(() => {
      throw new NotFoundError('Фильм с таким Id не найден');
    })
    .then((movie) => {
      console.log(movie);
      if (movie.owner.toString() === req.user._id) {
        return Movie.findByIdAndRemove(req.params.id).then(() => res.send({ message: 'Фильм удален!' }));
      }
      const authError = new ForbiddenError('Нельзя удалить чужой фильм');
      return next(authError);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        const error = new BadRequest('Переданы некорректные данные');
        return next(error);
      }
      return next(err);
    });
};

/* {
  "country":"США",
  "director":"Стивен Кайак ",
  "duration":61,
  "year":"2010",
  "description":"В конце 1960-х группа «Роллинг Стоунз»",
  "image":"https://api.nomoreparties.co/beatfilm-movies/uploads/thumbnail_stones_in_exile_b2f1b8f4b7.jpeg",
  "trailer":"https://www.youtube.com/watch?v=D5fBhbEJxEU",
  "nameRU":"«Роллинг Стоунз» в изгнании",
  "nameEN":"Stones in Exile",
  "thumbnail":"https://api.nomoreparties.co/beatfilm-movies/uploads/thumbnail_stones_in_exile_b2f1b8f4b7.jpeg",
  "movieId":1
} */

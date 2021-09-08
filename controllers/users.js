const User = require('../models/user');
/* const bcrypt = require('bcryptjs');
 */
const BadRequest = require('../errors/BadRequest');
const NotFoundError = require('../errors/NotFoundError');
/* const ConflictingRequest = require('../errors/ConflictingRequest');
const AuthorizationError = require('../errors/AuthorizationError'); */

/* module.exports.getUsers = (req, res, next) => {
  User.find({})
    .orFail(() => {
      throw new NotFoundError('Пользователи не найдены');
    })
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
}; */

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден');
    })
    .then((user) => {
      res.status(200).send({
        name: user.name,
        email: user.email,
        _id: user.id,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        const error = new BadRequest('Переданы некорректные данные');
        next(error);
      } else {
        next(err);
      }
    });
};

module.exports.editProfile = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден');
    })
    .then((user) => {
      res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        const error = new BadRequest('Переданы некорректные данные');
        next(error);
      } else {
        next(err);
      }
    });
};

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequest = require('../errors/BadRequest');
const NotFoundError = require('../errors/NotFoundError');
const ConflictingRequest = require('../errors/ConflictingRequest');
const AuthorizationError = require('../errors/AuthorizationError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res
        .cookie('jwt', token, {
          expires: new Date(Date.now() + 60 * 24 * 3600000),
          // httpOnly: true,
          httpOnly: true,
          sameSite: 'None',
          // secure: true,
          secure: true,
        })
        .status(200)
        .send({ token });
    })
    .catch(() => {
      const error = new AuthorizationError('Неправильная почта или пароль');
      next(error);
    });
};

module.exports.logout = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь не найден'));
      }
      return res
        .clearCookie('jwt')
        .status(200)
        .send({ message: 'Выход из профиля' });
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  User.findOne({ email })
    .then((userEmail) => {
      if (userEmail) {
        const emailError = new ConflictingRequest(
          'Пользователь с таким email уже существует',
        );
        next(emailError);
      }
      return bcrypt.hash(password, 10).then((hash) => User.create({
        name,
        email,
        password: hash,
      })
        .then((user) => res.status(201).send({
          name: user.name,
          email: user.email,
        }))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            const error = new BadRequest('Переданы некорректные данные');
            next(error);
          }
          next(err);
        }));
    })
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  console.log(req.user._id);
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден');
    })
    .then((user) => {
      res.status(200).send({
        user,
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
  const { email, name } = req.body;
  User.findOne({ email })
    .then((userEmail) => {
      if (userEmail) {
        const emailError = new ConflictingRequest(
          'Пользователь с таким email уже существует',
        );
        return next(emailError);
      }
      return User.findByIdAndUpdate(
        req.user._id,
        {
          name,
          email,
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
            return next(error);
          }

          if (err.code === 11000) {
            return next(
              new ConflictingRequest(
                'Переданный email уже используется другим пользователем',
              ),
            );
          }

          return next(err);
        });
    })
    .catch(next);
};

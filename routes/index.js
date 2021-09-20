const router = require('express').Router();
const usersRouter = require('./users');
const movieRouter = require('./movies');
const NotFoundError = require('../errors/NotFoundError');
const auth = require('../middlewares/auth');
const {
  createUser,
  login,
} = require('../controllers/users');

const { createUserValidation, loginUserValidation } = require('../middlewares/validation');

router.post('/signup', createUserValidation, createUser);
router.post('/signin', loginUserValidation, login);
router.use(auth);
router.use('/', usersRouter);
router.use('/', movieRouter);
router.all('*', (req, res, next) => {
  const error = new NotFoundError('Запрашиваемый ресурс не найден');
  next(error);
});

module.exports = router;

const usersRouter = require('express').Router();

const {
  getUser,
  /*
  logout, */
} = require('../controllers/users');

usersRouter.get('/users/me', getUser);
usersRouter.patch('/users/me', getUser);

module.exports = usersRouter;

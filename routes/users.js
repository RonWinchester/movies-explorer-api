const usersRouter = require('express').Router();

const {
  getUser,
  editProfile,
  logout,
} = require('../controllers/users');

const { editProfileValidation } = require('../middlewares/validation');

usersRouter.get('/users/me', getUser);
usersRouter.patch('/users/me', editProfileValidation, editProfile);
usersRouter.post('/logout', logout);

module.exports = usersRouter;

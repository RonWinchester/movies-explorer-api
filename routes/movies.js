const moviesRouter = require('express').Router();
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');
const { paramsValidation, createMovieValidator } = require('../middlewares/validation');

moviesRouter.get('/movies', getMovies);
moviesRouter.post('/movies', createMovieValidator, createMovie);
moviesRouter.delete('/movies/:id', paramsValidation, deleteMovie);

module.exports = moviesRouter;

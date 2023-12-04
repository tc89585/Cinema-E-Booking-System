const express = require('express');
const movieController = require('../controllers/movieController');

const router = express.Router();

router.get('/', movieController.getAllMovies);

router.get('/getMovieById/:movie_id', movieController.getMovieById);
module.exports = router;

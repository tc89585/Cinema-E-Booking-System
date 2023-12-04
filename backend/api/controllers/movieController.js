const Movie = require('../models/MovieModel');

const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.findAll();
    res.status(200).send(movies);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const getMovieById = async (req, res) => {
  const { movie_id } = req.params;
  try {
    const movie = await Movie.findByPk(movie_id);
    if (!movie) {
      return res.status(404).send({ message: 'Movie not found' });
    }
    res.status(200).send(movie);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

module.exports = {
  getAllMovies,
  getMovieById
};
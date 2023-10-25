const Movie = require('../models/MovieModel');

const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.findAll();
    res.status(200).send(movies);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

module.exports = {
  getAllMovies,
};

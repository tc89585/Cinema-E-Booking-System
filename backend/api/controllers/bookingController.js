// bookingController.js


const User = require('../models/UserModel');
const bcrypt = require('bcrypt');
const Movie = require('../models/MovieModel'); 
const Showtime = require('../models/ShowtimeModel'); 
const Promotion = require('../models/PromotionModel'); 
const Ticket = require('../models/TicketModel');  // Import your database connection
const Seat = require('../models/SeatModel')
const PaymentInfo = require('../models/PaymentInformationModel')


const getMovieDetails = async (req, res) => {
  const {movie_id} = req.body

  try {
    // Assuming you have a 'Movie' model with 'movie_id' as the primary key
    console.log('Searching for movie with ID:', movie_id);
    const movieDetails = await Movie.findByPk(movie_id);
    console.log('Movie details:', movieDetails);


    if (!movieDetails) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    // Send the movie details to the frontend
    res.json(movieDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getMovieDetails,
};

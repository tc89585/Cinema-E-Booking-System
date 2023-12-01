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
const getAvailableShowtimes = async (req, res) => {
  try {
    const movieId = parseInt(req.params.movie_id);
    const showDate = req.params.show_date;

    // Validate the date format (e.g., 'YYYY-MM-DD') and movieId
    if (!isValidDate(showDate) || isNaN(movieId)) {
      return res.status(400).json({ message: 'Invalid date format or movie ID' });
    }

    // Query the database to find available showtimes for a specific movie and date
    const availableShowtimes = await Showtime.findAll({
      where: {
        movie_id: movieId,
        show_date: showDate,
      },
      // Include additional attributes or conditions if necessary
    });

    // Respond with the available showtimes
    if (availableShowtimes.length > 0) {
      res.status(200).json(availableShowtimes);
    } else {
      res.status(404).json({ message: 'No available showtimes found' });
    }
  } catch (error) {
    // Handle errors appropriately
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Helper function to validate date format
function isValidDate(dateString) {
  const regEx = /^\d{4}-\d{2}-\d{2}$/;
  return dateString.match(regEx) != null;
}

module.exports = {
  getMovieDetails,
  getAvailableShowtimes,
};

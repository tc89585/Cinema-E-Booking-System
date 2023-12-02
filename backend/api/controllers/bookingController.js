// bookingController.js

const User = require('../models/UserModel');
const bcrypt = require('bcrypt');
const Movie = require('../models/MovieModel');
const Showtime = require('../models/ShowtimeModel');
const Promotion = require('../models/PromotionModel');
const Ticket = require('../models/TicketModel'); // Import your database connection
const Seat = require('../models/SeatModel');
const PaymentInfo = require('../models/PaymentInformationModel');
const Showroom = require('../models/ShowroomModel');
const TicketPrice = require('../models/TicketPriceModel');

const getMovieDetails = async (req, res) => {
  const { movie_id } = req.body;

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

const getSeatsForShowtime = async (req, res) => {
  try {
    const showtimeId = req.params.showtime_id;
    console.log(`Fetching seats for showtime ID: ${showtimeId}`); // Log showtime ID being queried

    const showtime = await Showtime.findByPk(showtimeId, {
      include: [
        {
          model: Showroom,
          include: [{ model: Seat }],
        },
      ],
    });

    console.log('Showtime data fetched:', showtime); // Log the fetched showtime data

    if (!showtime) {
      console.log('Showtime not found for ID:', showtimeId);
      return res.status(404).send('Showtime not found');
    }

    if (!showtime.Showroom) {
      console.log('Showroom not found for showtime ID:', showtimeId);
      return res
        .status(404)
        .send('Showroom for the specified showtime not found');
    }

    const seats = showtime.Showroom.Seats;
    console.log(
      `Seats fetched for Showroom ID ${showtime.showroom_id}:`,
      seats
    ); // Log the fetched seats

    res.json(seats);
  } catch (error) {
    console.error('Error fetching seats for showtime:', error);
    res.status(500).send('Server error');
  }
};
  // Function to get ticket prices
  const getTicketPrices = async (req, res) => {
    try {
      const prices = await TicketPrice.findAll();
      res.status(200).json(prices);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  };

module.exports = {
  getMovieDetails,
  getSeatsForShowtime,
  getAvailableShowtimes,
  getTicketPrices,
};

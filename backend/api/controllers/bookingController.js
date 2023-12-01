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

module.exports = {
  getMovieDetails,
  getSeatsForShowtime,
};

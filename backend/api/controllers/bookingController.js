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
const Booking = require('../models/BookingModel');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

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
  getDiscountRateByDescription = async (req, res) => {
    try {
      // Retrieve the description from the request parameter
      const { description } = req.params; // Adjust based on whether you're using params or query
  
      // Find the promotion with the given description
      const promotion = await Promotion.findOne({
        where: { description }
      });
  
      // Check if the promotion was found
      if (!promotion) {
        return res.status(404).json({ message: 'Promotion not found' });
      }
  
      // Send back the description and discount rate
      res.status(200).json({
        description: promotion.description,
        discountRate: promotion.discount_rate // Ensure this matches the field name in your model
      });
  
    } catch (error) {
      console.error("Error fetching promotion:", error);
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  };




const createBooking = async (req, res) => {
  try {
    const { user_id, showtime_id, booking_date, total_price, seatsAndTickets } = req.body;

    // Step 1: Create a new booking
    const newBooking = await Booking.create({
      user_id,
      showtime_id,
      booking_date,
      total_price,
    });

    // Extract the booking_id
    const booking_id = newBooking.booking_id;

    // Step 2: Create tickets and update seats
    for (const { seat_id, ticket_type } of seatsAndTickets) {
      // Step 2a: Create a new ticket
      await Ticket.create({
        booking_id,
        seat_id,
        ticket_type,
      });

      // Step 2b: Update the corresponding seat to mark it as booked
      if (seat_id) {
        await Seat.update(
          { is_booked: true },
          {
            where: {
              seat_id: seat_id,
            },
          }
        );
      } else {
        console.error('Seat ID is undefined for ticket:', { seat_id, ticket_type });
        // Handle the error or log it as needed
      }
    }

    // Step 3: Retrieve individual showtime and seat information
const bookingDetails = await Booking.findByPk(booking_id);

if (!bookingDetails) {
  return res.status(404).json({ error: 'Booking not found' });
}

const showtimeDetails = await Showtime.findByPk(showtime_id);

if (!showtimeDetails) {
  return res.status(404).json({ error: 'Showtime not found' });
}

// Step 4: Retrieve seat numbers for the booked seats
const seatNumbers = [];

for (const seatInfo of seatsAndTickets) {
  const seatDetails = await Seat.findByPk(seatInfo.seat_id, {
    attributes: ['seat_number'],
  });

  if (seatDetails) {
    seatNumbers.push(seatDetails.seat_number);
  }
}

// Step 5: Send confirmation email
const emailContent = `Thank you for booking with us. Here is information regarding your booking:\n
  Total Price: ${bookingDetails.total_price}\n
  Booking Date: ${bookingDetails.booking_date}\n
  Show Date: ${showtimeDetails.show_date}\n
  Show Time: ${showtimeDetails.show_time}\n
  Seats: ${seatNumbers.join(', ')}\n
  Thank you! Please respond with any questions.`;

    // Send the email using your preferred email sending mechanism

    const {createTransport} = require('nodemailer');

    const transporter = createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      auth: {
        user: "cinemaebook080@gmail.com",
        pass:
        "xsmtpsib-540cb9169874497c3d6ec6ee47c8359e020c90f21915faacbcc030a54761c014-TkKzbwDOBRGmf6aI",
      }
    })


    //Get user email

    const getUserEmailById = async () => {
      try {
        // Find the user by user_id
        const user = await User.findByPk(user_id);
    
        if (!user) {
          console.error('User not found');
          return null; // or throw an error, depending on your needs
        }
        console.log("found user: ", user);
    
        // Extract and return the email
        const userEmail = user.email;
        return userEmail;
      } catch (error) {
        console.error('Error fetching user email:', error);
        throw error; // or handle the error appropriately
      }
    };



    const mailOptions = {
      from: 'cinemaebook080@gmail.com',
      to: await getUserEmailById(), // Use the user's email address
      subject: 'Welcome to Cinema eBook',
      text: emailContent,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });


    // Send a success response if needed
    res.status(200).json({ message: 'Booking created successfully', booking_id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};









module.exports = {
  getMovieDetails,
  getSeatsForShowtime,
  getAvailableShowtimes,
  getTicketPrices,
  getDiscountRateByDescription,
  createBooking,
};

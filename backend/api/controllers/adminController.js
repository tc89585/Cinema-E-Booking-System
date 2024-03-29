const User = require('../models/UserModel');
const bcrypt = require('bcrypt');
const Movie = require('../models/MovieModel'); 
const Showtime = require('../models/ShowtimeModel'); 
const Promotion = require('../models/PromotionModel'); 
const Ticket = require('../models/TicketModel'); 
const Showroom = require('../models/ShowroomModel');
const TicketPrice = require('../models/TicketPriceModel');
const { createTransport } = require('nodemailer');
const Sequelize = require('sequelize');
const Seat = require("../models/SeatModel");

const AdminController = {
  // Function to create a new admin user
  createAdmin: async (req, res) => {
    try {
        // Extract user identifier (e.g., email or user_id) from the request
        const { email } = req.body; // Assuming we're using email to identify the user

        // Find the user by email
        const user = await User.findOne({ where: { email: email } });

        // Check if the user exists
        if (!user) {
            return res.status(404).send({ message: "User not found." });
        }

        // Update the user's role to 'admin'
        user.role = 'admin';
        await user.save();

        res.status(200).json({
            message: 'User role updated to admin successfully',
            user_id: user.user_id,
            email: user.email,
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
},

  // Function to create a promotion
  createPromotion: async (req, res) => {
    try {
      const promotionData = req.body;
  
      // Create promotion in the database
      const promotion = await Promotion.create(promotionData);
  
      // Get all active users
      const users = await User.findAll({
        where: {
          account_status: 'active',
        },
      });
  
      // Extract email addresses from users
      const emailAddresses = users.map(user => user.email);
  
      // Send email to each user
      const transporter = createTransport({
        host: 'smtp-relay.brevo.com',
        port: 587,
        auth: {
          user: 'cinemaebook080@gmail.com',
          pass: 'xsmtpsib-540cb9169874497c3d6ec6ee47c8359e020c90f21915faacbcc030a54761c014-TkKzbwDOBRGmf6aI',
        },
      });
  
      for (const email of emailAddresses) {
        const emailText = `Dear customer, we have a winter sale going on. Please use this code at checkout: ${promotion.description}`;
  
        const mailOptions = {
          from: 'cinemaebook080@gmail.com',
          to: email,
          subject: 'New Promotion Alert',
          text: emailText,
        };
  
        await transporter.sendMail(mailOptions);
      }
  
      res.status(201).json({
        message: 'Promotion created successfully',
        promotion_id: promotion.PromotionID,
        description: promotion.Description,
      });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },

  // Function to update movie information
    updateMovieInfo: async (req, res) => {
    const { movieId, updateData } = req.body;
    try {
      const movie = await Movie.findByPk(movieId);
      if (!movie) {
        return res.status(404).send({ message: 'Movie not found' });
      }
      // Object.assign is suitable for partial updates
      Object.assign(movie, updateData);
      await movie.save();
      res.status(200).json({ message: 'Movie updated successfully', movie });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
},

  // Function to delete a movie
  deleteMovie: async (req, res) => {
    const { movie_id } = req.params;
    try {
      const movie = await Movie.findByPk(movie_id);
      if (!movie) {
        return res.status(404).send({ message: 'Movie not found' });
      }
      await movie.destroy();
      res.status(200).json({ message: 'Movie deleted successfully' });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },

  // Function to edit ticket prices
  editTicketPrice: async (req, res) => {
    try {
      const { ticket_type, ticket_price } = req.body;
      const updated = await TicketPrice.update({ ticket_price }, {
        where: { ticket_type }
      });
  
      if (updated[0] > 0) {
        res.status(200).send({ message: 'Ticket price updated successfully.' });
      } else {
        res.status(404).send({ message: 'Ticket type not found.' });
      }
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },

  // Function to add or update promotions
  updatePromotion: async (req, res) => {
    const { promotionId, updateData } = req.body;
    try {
      const promotion = await Promotion.findByPk(promotionId);
      if (!promotion) {
        return res.status(404).send({ message: 'Promotion not found' });
      }
      Object.assign(promotion, updateData);
      await promotion.save();
      res.status(200).json({ message: 'Promotion updated successfully', promotion });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },

  // Function to add a new showtime
  addShowtime: async (req, res) => {
    try {
        // Extract showtime data and movie title from the request
        const { title, show_date, show_time, duration } = req.body;

        // Find the movie by title
        const movie = await Movie.findOne({ where: { title: title } });

        // Check if the movie exists
        if (!movie) {
            return res.status(404).send({ message: "Movie not found." });
        }

        // Check if a showtime for this movie at the same date and time already exists
        const existingShowtime = await Showtime.findOne({
            where: {
                movie_id: movie.movie_id,
                show_date,
                show_time
            }
        });

        // If an existing showtime is found, send an error response
        if (existingShowtime) {
            console.error("Showtime for this movie at the specified date and time already exists.");
            return res.status(400).send({ message: "Showtime already exists for this movie at the specified date and time." });
        }

        // Generate a unique name for the new showroom
        const showroomName = `Showroom-${Date.now()}`;

        // Create a new showroom
        const newShowroom = await Showroom.create({
            showroom_name: showroomName,
            seat_rows: 5,
            seat_columns: 10,
            seat_capacity: 50
        });

        // Check if the new showroom was created successfully
        if (!newShowroom || !newShowroom.showroom_id) {
            console.error("Failed to create new showroom, no showroom ID returned.");
            return res.status(500).send({ message: "Failed to create new showroom." });
        }

        console.log("New showroom created with ID:", newShowroom.showroom_id);

        // Create 50 seats in a 5x10 arrangement for the new showroom
        const rows = ['A', 'B', 'C', 'D', 'E'];
        const columns = 10;
        for (let row of rows) {
            for (let col = 1; col <= columns; col++) {
                await Seat.create({
                    showroom_id: newShowroom.showroom_id,
                    seat_number: `${row}${col}`,
                    is_booked: false
                });
            }
        }

        // Create the showtime using the new showroom's ID
        const newShowtime = await Showtime.create({
            movie_id: movie.movie_id,
            showroom_id: newShowroom.showroom_id,
            show_date,
            show_time,
            duration
        });

        res.status(201).json({ message: 'Showtime added successfully', newShowtime });

    } catch (error) {
        console.error("Error adding showtime: ", error);
        return res.status(500).send({ message: "Failed to add new showtime." });
    }
},

  

  // Function to update a showtime
  updateShowtime: async (req, res) => {
    const { showtimeId, updateData } = req.body;
    try {
      const showtime = await Showtime.findByPk(showtimeId);
      if (!showtime) {
        return res.status(404).send({ message: 'Showtime not found' });
      }
  
      // Check if the updateData has date and time information to update
      if (updateData.show_date || updateData.show_time) {
        // Check if a showtime for this movie at the same date and time already exists
        const conflictingShowtime = await Showtime.findOne({
          where: {
            movie_id: showtime.movie_id,
            show_date: updateData.show_date || showtime.show_date,
            show_time: updateData.show_time || showtime.show_time,
            showtime_id: { [Sequelize.Op.ne]: showtimeId } // Exclude the current showtime
          }
        });
  
        // If a conflicting showtime is found, send an error response
        if (conflictingShowtime) {
          return res.status(400).send({ message: 'Another showtime already exists at the specified date and time.' });
        }
      }
  
      // No conflicts found, proceed with update
      Object.assign(showtime, updateData);
      await showtime.save();
      res.status(200).json({
        message: 'Showtime updated successfully',
        showtime
      });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },

  // Function to delete a showtime
  deleteShowtime: async (req, res) => {
    const { showtimeId } = req.params;
    try {
      const showtime = await Showtime.findByPk(showtimeId);
      if (!showtime) {
        return res.status(404).send({ message: 'Showtime not found' });
      }
      await showtime.destroy();
      res.status(200).json({ message: 'Showtime deleted successfully' });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },

  // Function to get all promotions
  getPromotions: async (req, res) => {
    try {
        const promotions = await Promotion.findAll();
        res.status(200).json(promotions);
    } catch (error) {
        console.error("Error fetching promotions:", error);
        res.status(500).send({ message: "Failed to retrieve promotions" });
    }
  },
    // Function to suspend or activate a user account by email and status
    manageUser: async (req, res) => {
      const { email, account_status } = req.params;
    
      // Basic validation for email and status
      if (!email || !account_status) {
        return res.status(400).json({ message: 'Email and status are required' });
      }
    
      if (!['active', 'inactive'].includes(account_status)) {
        return res.status(400).json({ message: 'Invalid status provided' });
      }
    
      try {
        // Check if the user exists by email
        const user = await User.findOne({
          where: { email: email },
        });
    
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        // Update the user's account status
        user.account_status = account_status;
        await user.save();
    
        res.status(200).json({ message: `User account status updated to ${user.account_status}` });
      } catch (error) {
        res.status(500).json({ message: 'Error managing user account', error: error.message });
      }
    },
    

    // Function to display all users and their email and account status
    getAllUsers: async (req, res) => {
      try {
          const users = await User.findAll({
              attributes: ['email', 'account_status']
          });
          res.status(200).json(users);
      } catch (error) {
          console.error('Error fetching users:', error);
          res.status(500).send({ message: 'Error fetching user data' });
      }
  },
  addMovie: async (req, res) => {
    try {
      const { title, category, director, producer, synopsis, mpaa_rating, cast, Poster_url, trailer_url } = req.body;
  
      // Validate input
      if (!title || !category || !director || !producer || !synopsis || !mpaa_rating || !cast || !Poster_url || !trailer_url) {
        return res.status(400).send({ message: "All fields are required" });
      }
  
      // Check if the movie with the same title already exists
      const existingMovie = await Movie.findOne({ where: { title } });
  
      if (existingMovie) {
        return res.status(409).send({ message: "Movie with the same title already exists" });
      }
  
      // Create a new movie record
      const newMovie = await Movie.create({
        title,
        category,
        director,
        producer,
        synopsis,
        mpaa_rating,
        cast,
        Poster_url,
        trailer_url,
      });
  
      // Send a success response
      res.status(201).send({ message: "Movie added successfully", movie: newMovie });
    } catch (error) {
      console.error("Error adding movie:", error);
      res.status(500).send({ message: "Error adding new movie" });
    }
  },
  
  deletePromotion: async (req, res) => {
    try {
        const { promotion_id } = req.params;

        // Delete the promotion with the given ID
        const result = await Promotion.destroy({
            where: {
                promotion_id: promotion_id
            }
        });

        if (result === 0) {
            // No promotion found with the given ID
            return res.status(404).json({ message: 'Promotion not found' });
        }

        // Respond back that the deletion was successful
        res.status(200).json({ message: 'Promotion deleted successfully' });
    } catch (error) {
        // Handle any errors that occur during the process
        res.status(500).send({ message: error.message });
        console.error('Error deleting promotion:', error);
    }
}
};


module.exports = AdminController;

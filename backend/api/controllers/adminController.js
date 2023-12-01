const User = require('../models/UserModel');
const bcrypt = require('bcrypt');
const Movie = require('../models/MovieModel'); 
const Showtime = require('../models/ShowtimeModel'); 
const Promotion = require('../models/PromotionModel'); 
const Ticket = require('../models/TicketModel'); 

const AdminController = {
  // Function to create a new admin user
  createAdmin: async (req, res) => {
    try {
      const { password, ...adminData } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const admin = await User.create({ ...adminData, password: hashedPassword, role: 'Admin' });
      res.status(201).json({
        message: 'Admin created successfully',
        user_id: admin.UserID,
        email: admin.Email,
      });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },

  // Function to create a promotion
  createPromotion: async (req, res) => {
    try {
      const promotionData = req.body;
      const promotion = await Promotion.create(promotionData);
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
      Object.assign(movie, updateData);
      await movie.save();
      res.status(200).json({ message: 'Movie updated successfully', movie });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },

  // Function to delete a movie
  deleteMovie: async (req, res) => {
    const { movieId } = req.params;
    try {
      const movie = await Movie.findByPk(movieId);
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
    const { ticketTypeId, newPrice } = req.body;
    
    try {
      const ticketType = await Ticket.findByPk(ticketTypeId);
      
      if (!ticketType) {
        return res.status(404).send({ message: 'Ticket type not found' });
      }
  
      // Update the ticket type's price
      ticketType.price = newPrice;
      
      // Save the updated ticket type
      await ticketType.save();
      
      // Respond with success message
      res.status(200).json({ message: 'Ticket price updated successfully for future buyers' });
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
      const showtimeData = req.body;
      const newShowtime = await Showtime.create(showtimeData);
      res.status(201).json({
        message: 'Showtime added successfully',
        showtime_id: newShowtime.ShowtimeID
      });
    } catch (error) {
      res.status(500).send({ message: error.message });
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


};

module.exports = AdminController;

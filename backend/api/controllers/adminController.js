const User = require('../models/UserModel');
const bcrypt = require('bcrypt');
const Movie = require('../models/MovieModel'); 
const Showtime = require('../models/ShowtimeModel'); 
const Promotion = require('../models/PromotionModel'); 
const Ticket = require('../models/TicketModel'); 
const Showroom = require('../models/ShowroomModel');
const TicketPrice = require('../models/TicketPriceModel');
const AdminController = {
  // Function to create a new admin user
  createAdmin: async (req, res) => {
    try {
      const { password, ...adminData } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const admin = await User.create({ ...adminData, password: hashedPassword, role: 'admin' });
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
      // Extract the showtime data from the request
      const { movie_id, show_date, show_time, duration } = req.body;
  
      // Generate a unique name for the new showroom
      const showroomName = `Showroom-${Date.now()}`;
  
      // Create a new showroom
      let newShowroom;
      try {
        newShowroom = await Showroom.create({
          showroom_name: showroomName,
          seat_rows: 5, 
          seat_columns: 10,
          seat_capacity: 50 
        });
      } catch (showroomError) {
        console.error("Error creating new showroom: ", showroomError);
        return res.status(500).send({ message: "Failed to create new showroom." });
      }
  
      // Check if the new showroom was created successfully
      if (!newShowroom || !newShowroom.showroom_id) {
        console.error("Failed to create new showroom, no showroom ID returned.");
        return res.status(500).send({ message: "Failed to create new showroom." });
      }
  
      console.log("New showroom created with ID:", newShowroom.showroom_id);
  
      // Now create the showtime using the new showroom's ID
      const newShowtime = await Showtime.create({
        movie_id,
        showroom_id: newShowroom.showroom_id,
        show_date,
        show_time,
        duration
      });
  
      console.log("New showtime created with ID:", newShowtime.showtime_id);
  
      res.status(201).json({
        message: 'Showtime and showroom added successfully',
        showtime_id: newShowtime.showtime_id,
        showroom_id: newShowroom.showroom_id
      });
    } catch (error) {
      console.error("Error in addShowtime: ", error);
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
};


module.exports = AdminController;

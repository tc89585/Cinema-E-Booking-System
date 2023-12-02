const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateUser, isAdmin } = require('../middlewares/authentication'); // Adjust if necessary

// Define combined admin authentication middleware
const adminAuthMiddleware = [authenticateUser, isAdmin];

// Route to create a new admin
router.post('/createAdmin', adminAuthMiddleware, adminController.createAdmin);

// Route to create a promotion
router.post('/createPromotion', adminAuthMiddleware, adminController.createPromotion);

// Route to update movie information
router.put('/updateMovieInfo', adminAuthMiddleware, adminController.updateMovieInfo);

// Route to delete a movie
router.delete('/deleteMovie/:movieId', adminAuthMiddleware, adminController.deleteMovie);

// Route to edit ticket prices
router.put('/editTicketPrice', adminAuthMiddleware, adminController.editTicketPrice);

// Route to add or update promotions
router.put('/updatePromotion', adminAuthMiddleware, adminController.updatePromotion);

// Route to add a new showtime
router.post('/addShowtime', adminAuthMiddleware, adminController.addShowtime);

// Route to update a showtime
router.put('/updateShowtime', adminAuthMiddleware, adminController.updateShowtime);

// Route to delete a showtime
router.delete('/deleteShowtime/:showtimeId', adminAuthMiddleware, adminController.deleteShowtime);

// Route to get all promotions
router.get('/getPromotions',adminAuthMiddleware,adminController.getPromotions);

module.exports = router;

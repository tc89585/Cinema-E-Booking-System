const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateUser, isAdmin } = require('../middlewares/authentication'); // Adjust if necessary

// Define combined admin authentication middleware
const adminAuthMiddleware = [authenticateUser, isAdmin];

// Route to create a new admin
router.patch('/updateUserRoleToAdmin', adminAuthMiddleware, adminController.createAdmin);

// Route to create a promotion
router.post('/createPromotion', adminAuthMiddleware, adminController.createPromotion);

// Route to update movie information
router.patch('/updateMovieInfo', adminAuthMiddleware, adminController.updateMovieInfo);

// Route to delete a movie
router.delete('/deleteMovie/:movie_id', adminAuthMiddleware, adminController.deleteMovie);

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

// Route to suspend a user by email
router.patch('/manageUser/:email/:account_status',adminAuthMiddleware, adminController.manageUser);

// Route to get all users
router.get('/getAllUsers',adminAuthMiddleware, adminController.getAllUsers);

// Route to add movie
router.post('/addMovie',adminAuthMiddleware, adminController.addMovie);

// Route to delete promotion
router.delete('/deletePromotion/:promotion_id', adminAuthMiddleware, adminController.deletePromotion);

module.exports = router;

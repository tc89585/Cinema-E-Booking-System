
// bookingRouter.js
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Define routes
router.get('/getMovieDetails', bookingController.getMovieDetails);
router.get('/getAvailableShowtimes/:movie_id/:show_date', bookingController.getAvailableShowtimes);

module.exports = router;

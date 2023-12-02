// bookingRouter.js
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Define routes
router.get('/getMovieDetails', bookingController.getMovieDetails);
router.get('/getSeatsForShowtime/:showtime_id',bookingController.getSeatsForShowtime);
router.get('/getAvailableShowtimes/:movie_id/:show_date', bookingController.getAvailableShowtimes);
router.post('/createBooking', bookingController.createBooking);
router.get('/getTicketPrice', bookingController.getTicketPrices);
router.get('/getDiscountRateByDescription/:description', bookingController.getDiscountRateByDescription);

module.exports = router;

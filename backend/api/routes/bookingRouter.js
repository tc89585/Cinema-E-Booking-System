// bookingRouter.js
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Define routes
router.get('/getMovieDetails', bookingController.getMovieDetails);
router.get(
  '/getSeatsForShowtime/:showtime_id',
  bookingController.getSeatsForShowtime
);
module.exports = router;

const express = require('express');
const router = express.Router();
const ShowingController = require('../controllers/ShowingController');

router.get('/showings/:showingId/available-seats', ShowingController.getAvailableSeats);

module.exports = router;

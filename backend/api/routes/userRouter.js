const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const {authenticateUser} = require('../middlewares/authentication');

// User account related routes
router.post('/', userController.createUser); //works
router.post('/login', userController.login); //works
router.get('/forgotpassword', userController.forgotPassword);

// User profile editing routes
router.put('/edit-profile', authenticateUser, userController.editProfile); // Edit profile

// User's Payment methods related routes
router.post('/payment-methods', authenticateUser, userController.createPaymentMethod); // Create payment method
router.put('/payment-methods/:payment_id', authenticateUser, userController.editPaymentMethod); // Edit payment method
router.get('/payment-methods', authenticateUser, userController.getPaymentMethods); // Get payment methods

// Booking a seat for a showing
router.post('/book-seat', authenticateUser, userController.bookSeat); // Book seat

module.exports = router;

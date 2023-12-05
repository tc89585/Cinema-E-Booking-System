const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateUser } = require('../middlewares/authentication');

// User account related routes
router.post('/', userController.createUser); //works
router.post('/login', userController.login); //works
router.post('/forgotpassword', userController.forgotPassword);
router.post('/sendCode', userController.sendCode);
router.post('/checkCode', userController.checkCode);

// User profile editing routes
router.put('/edit-profile', authenticateUser, userController.editProfile); // Edit profile

// User's Payment methods related routes
router.post(
  '/payment-methods',
  authenticateUser,
  userController.createPaymentMethod
); // Create payment method
router.put(
  '/payment-methods/:payment_id',
  authenticateUser,
  userController.editPaymentMethod
); // Edit payment method
router.get(
  '/payment-methods',
  authenticateUser,
  userController.getPaymentMethods
); // Get payment methods

router.get(
  '/getUserById/:user_id',
  authenticateUser,
  userController.getUserById
);

router.get(
  '/getBookingHistory',
  authenticateUser,
  userController.getBookingHistory
);

router.post('/verifyPayment', authenticateUser, userController.verifyPayment);

module.exports = router;

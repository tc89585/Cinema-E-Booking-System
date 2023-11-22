const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateUser = require('../middlewares/authentication');

// User account related routes
router.post('/', userController.createUser); //works
router.post('/login', userController.login); //works
router.post('/forgotpassword', userController.forgotPassword);

// User profile editing routes
router.put('/edit-profile', authenticateUser, userController.editProfile); //works

// User's Payment methods related routes
router.post(
  '/payment-methods',
  authenticateUser,
  userController.createPaymentMethod
); //works
router.put(
  '/payment-methods/:payment_id',
  authenticateUser,
  userController.editPaymentMethod
); //works
router.get(
  '/payment-methods',
  authenticateUser,
  userController.getPaymentMethods
); //works

module.exports = router;

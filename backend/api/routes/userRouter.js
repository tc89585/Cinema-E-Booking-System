const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/', userController.createUser);

/* 
   1. implement loginUser function inside controllers/userController to login a user when they enter their email and password
      //use bcyrpt compare
*/
//router.post('/login', userController.loginUser);






/* 
  1.implement editProfile function inside controllers/userController
  2. implement authenticateUser function inside middlewares/authentication.js
        //to ensure that only authenticated users are allowed to access and modify their own profiles
*/
//router.put('/edit-profile', authenticateUser, userController.editProfile);

module.exports = router;

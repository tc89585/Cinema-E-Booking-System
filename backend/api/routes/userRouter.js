const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
//const { authenticateUser } = require('../middlewares/authentication');



router.post('/', userController.createUser);
router.post('/login', userController.login);
router.post('/forgotpassword',userController.forgotPassword);
//router.put('/edit-profile', authenticateUser, userController.editProfile);
router.put('/edit-profile', userController.editProfile);

module.exports = router;

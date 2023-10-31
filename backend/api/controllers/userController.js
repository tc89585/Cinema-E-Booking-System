const User = require('../models/UserModel');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    
    res.status(201).json({
      message: 'User created successfully',
      userId: user.user_id,
      email: user.email,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
    console.error(error);
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by their email
    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      // User with the provided email does not exist
      return res.status(401).json({ message: 'Email: Authentication failed' });
    }

    if (user.password === password) {
      // Passwords match, user is authenticated
      console.log("true is match");
    } else {
      // Passwords do not match
      console.log("user.password:", user.password, "password:", password);
      console.log("false not a match");
    }

    if (user.password === password) {
      // Passwords match, user is authenticated
      return res.status(200).json({ message: 'Authentication successful', user });
    } else {
      // Passwords do not match
      return res.status(401).json({ message: 'Password: Authentication failed' });
    }
  } catch (error) {
    // Handle any potential errors
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Find the user by their email
    const user = await User.findOne({ email });

    if (!user) {
      // User with the provided email does not exist
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a unique token for password reset
    const resetToken = jwt.sign({ userId: user.user_id }, 'your-secret-key', { expiresIn: '1h' });

    // Save the reset token and expiration time to the user record
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    await user.save();

    // Send an email with a link for password reset
    const transporter = nodemailer.createTransport({
      // Configure your email service here
    });

    const resetLink = `http://your-app-url/reset-password?token=${resetToken}`;
    const mailOptions = {
      from: 'your-email@example.com',
      to: email,
      subject: 'Password Reset Request',
      text: `You can reset your password by clicking on the following link: ${resetLink}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Password reset link sent to your email' });
  } catch (error) {
    // Handle any potential errors
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


const editProfile = async (req, res) => {
  try {
    // Retrieve the user's ID from the authenticated user
    const userId = req.body.user_id;

    // Retrieve the form data from the request
    const { firstname, lastname, billing_address, password, payment_card, is_subscribed } = req.body;

    // Query the database to get the current user's data using async/await syntax
    const user = await User.findByPk(userId);


    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Ensure users cannot modify their email address
    user.firstname = firstname;
    user.lastname = lastname;
    user.billing_address = billing_address;
    user.payment_card = payment_card;
    user.is_subscribed = is_subscribed;

    if (password) {
      //const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    // Save the updated user information
    const updatedUser = await user.save();

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
    console.error(error);
  }
};

module.exports = { createUser, login, forgotPassword, editProfile };

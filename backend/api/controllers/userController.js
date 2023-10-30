const User = require('../models/UserModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const createUser = async (req, res) => {
  try {
    //hash pw
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = await User.create({
      ...req.body,
      password: hashedPassword,
    });

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




const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by their email
    const user = await User.findOne({ email });

    if (!user) {
      // User with the provided email does not exist
      return res.status(401).json({ message: 'Authentication failed' });
    }

    // Compare the entered password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      // Passwords match, user is authenticated
      return res.status(200).json({ message: 'Authentication successful', user });
    } else {
      // Passwords do not match
      return res.status(401).json({ message: 'Authentication failed' });
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




//*TODO*
//const editProfile = ...

module.exports = { createUser };
module.exports = { login };
module.exports = { forgotPassword };

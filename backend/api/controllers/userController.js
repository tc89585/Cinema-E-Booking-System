const User = require('../models/UserModel');
const PaymentInformation = require('../models/PaymentInformationModel');
const Booking = require('../models/BookingModel');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');

const getUserById = async (req, res) => {
  const user_id = req.user.user_id;

  try {
    const user = await User.findByPk(user_id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Function to generate a random verification code
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// In-memory storage for verification codes (you should replace this with a database in a production environment)
const verificationCodeStore = {};

// Function to store the verification code
const storeVerificationCode = (email, code) => {
  verificationCodeStore[email] = code;
  console.log('Verification Code Store:', verificationCodeStore);
};

// Function to retrieve the stored verification code
const getStoredVerificationCode = (email) => {
  return verificationCodeStore[email];
};

// New route to send verification code
const sendCode = async (req, res) => {
  try {
    const { email } = req.body;
    const verificationCode = generateVerificationCode(); // Implement a function to generate a verification code
    storeVerificationCode(email, verificationCode); // Implement a function to store the code (e.g., in-memory cache, database)

    // Send the verification code to the user's email using nodemailer or any other email service

    const { createTransport } = require('nodemailer');

    const transporter = createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      auth: {
        user: 'cinemaebook080@gmail.com',
        pass: 'xsmtpsib-540cb9169874497c3d6ec6ee47c8359e020c90f21915faacbcc030a54761c014-TkKzbwDOBRGmf6aI',
      },
    });

    const emailText = `Your verification code is: ${verificationCode}`;

    const mailOptions = {
      from: 'cinemaebook080@gmail.com',
      to: email, // Use the user's email address
      subject: 'Verification Code',
      text: emailText,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

    res.status(200).json({ message: 'Verification code sent successfully' });
  } catch (error) {
    res.status(500).send({ message: error.message });
    console.error(error);
  }
};

// New route to check verification code
const checkCode = async (req, res) => {
  try {
    const { email, code } = req.body;
    const storedCode = getStoredVerificationCode(email); // Implement a function to retrieve the stored code
    console.log(`Code entered by user: ${code}`);
    console.log(`Stored code for ${email}: ${storedCode}`);
    if (code === storedCode) {
      // Verification successful
      res.status(200).json({ message: 'Verification successful' });
    } else {
      // Verification failed
      res.status(400).json({ message: 'Invalid verification code' });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
    console.error(error);
  }
};

const createUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ email, password: hashedPassword });

    const { createTransport } = require('nodemailer');

    const transporter = createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      auth: {
        user: 'cinemaebook080@gmail.com',
        pass: 'xsmtpsib-540cb9169874497c3d6ec6ee47c8359e020c90f21915faacbcc030a54761c014-TkKzbwDOBRGmf6aI',
      },
    });

    const emailText = `
      Thank you for creating an account with us. We are happy that you get to be a part of the cinema-ebook family.
    `;

    const mailOptions = {
      from: 'cinemaebook080@gmail.com',
      to: user.email, // Use the user's email address
      subject: 'Welcome to Cinema eBook',
      text: emailText,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
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
    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      return res
        .status(401)
        .json({ message: 'User does not exist with that email' });
    }

    if (user.account_status !== 'active') {
      return res.status(401).json({ message: 'User account is inactive' });
    }

    const plainTextPassword = password;
    const hashedPassword = user.password;

    bcrypt.compare(plainTextPassword, hashedPassword, (err, result) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ message: 'Internal Server Error' });
      }

      if (result) {
        const { password, ...payload } = user.toJSON();
        const token = jwt.sign(payload, 'cinema');
        return res
          .status(200)
          .json({ message: 'Authentication successful', token: token });
      } else {
        return res.status(401).json({ message: 'Authentication failed' });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const forgotPassword = async (req, res) => {
  try {
    console.log('Request Body:', req.body);
    const { email } = req.body;

    // Find the user based on the provided email
    const user = await User.findOne({ where: { email } });

    // Ensure the user is found
    if (!user) {
      return res
        .status(401)
        .json({ message: 'User does not exist with that email' });
    }

    // Generate a unique token for password reset
    const resetToken = jwt.sign({ userId: user.user_id }, 'your-secret-key', {
      expiresIn: '1h',
    });

    // Save the reset token and expiration time to the user record
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    await user.save();

    // Create the reset link with the token
    const resetLink = `http://localhost:8080/users/forgotPassword?token=${encodeURIComponent(
      resetToken
    )}`;

    // Send the password reset email to the user with the reset link
    const { createTransport } = require('nodemailer');
    const transporter = createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      auth: {
        user: 'cinemaebook080@gmail.com',
        pass: 'xsmtpsib-540cb9169874497c3d6ec6ee47c8359e020c90f21915faacbcc030a54761c014-TkKzbwDOBRGmf6aI',
      },
    });

    const emailText = `
      Thank you for creating an account with us. We are happy that you get to be a part of the cinema-ebook family.
    `;

    const mailOptions = {
      from: 'cinemaebook080@gmail.com',
      to: user.email,
      subject: 'Welcome to Cinema eBook',
      text: `You can reset your password by clicking on the following link: ${resetLink}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

    res.status(201).json({
      message: 'Password reset initiated successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};

const editProfile = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { firstname, lastname, billing_address, password, is_subscribed } =
      req.body;

    // Query the database for the current user
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user details
    user.firstname = firstname;
    user.lastname = lastname;
    user.billing_address = billing_address;
    user.is_subscribed = is_subscribed;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    // Save the updated user information
    await user.save();

    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const editPaymentMethod = async (req, res) => {
  try {
    // Retrieve the user's ID from the token (authenticateUser middleware set the 'user' property)
    const userId = req.user.user_id;
    const paymentId = req.params.payment_id;
    const { card_type, card_number, expiration_date } = req.body;

    // Find the payment method by ID and user ID
    const paymentInfo = await PaymentInformation.findOne({
      where: { payment_id: paymentId, user_id: userId },
    });

    if (!paymentInfo) {
      return res.status(404).json({ error: 'Payment method not found' });
    }

    // Update payment details
    paymentInfo.card_type = card_type;
    paymentInfo.card_number = card_number;
    paymentInfo.expiration_date = expiration_date;

    // Save the updated payment information
    await paymentInfo.save();

    res.status(200).json({ message: 'Payment method updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getPaymentMethods = async (req, res) => {
  const userId = req.user.user_id;

  try {
    // Fetch all payment methods for the given user
    const paymentMethods = await PaymentInformation.findAll({
      where: { user_id: userId },
    });

    if (!paymentMethods) {
      return res
        .status(404)
        .json({ message: 'No payment methods found for this user.' });
    }
    res.status(200).json(paymentMethods);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const createPaymentMethod = async (req, res) => {
  try {
    // Get the user ID from the authenticated user (stored in req.user from the middleware)
    const userId = req.user.user_id;

    // Get the payment method details from the request body
    const { card_type, card_number, expiration_date } = req.body;

    // Create a new payment method record
    const paymentMethod = await PaymentInformation.create({
      user_id: userId,
      card_type,
      card_number,
      expiration_date,
    });

    res.status(201).json({
      message: 'Payment method created successfully',
      paymentMethod,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getBookingHistory = async (req, res) => {
  try {
    const userId = req.user.user_id;

    // Fetching the booking history for the given user
    const bookingHistory = await Booking.findAll({
      where: {
        user_id: userId,
      },
      order: [['booking_date', 'DESC']], // Optional: Order by booking date, newest first
    });

    // Sending the booking history as a response
    res.json(bookingHistory);
  } catch (error) {
    // Handle any errors
    console.error('Error fetching booking history:', error);
    res.status(500).send('Error fetching booking history');
  }
};

// In your Node.js/Express server

const verifyPayment = async (req, res) => {
  const { card_type, card_number, expiration_date, payment_id } = req.body;
  const userId = req.user.user_id;
  console.log('received request with body: ', req.body);

  try {
    let paymentInfo;
    if (payment_id) {
      paymentInfo = await PaymentInformation.findOne({
        where: { payment_id, user_id: userId },
      });
    } else {
      paymentInfo = await PaymentInformation.findOne({
        where: { card_type, card_number, expiration_date, user_id: userId },
      });
    }

    if (paymentInfo) {
      res.status(200).json({ message: 'Payment verified successfully' });
    } else {
      res.status(400).json({ error: 'Payment details do not match' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  createUser,
  login,
  forgotPassword,
  editProfile,
  editPaymentMethod,
  getPaymentMethods,
  createPaymentMethod,
  getUserById,
  getBookingHistory,
  sendCode,
  checkCode,
  verifyPayment,
};

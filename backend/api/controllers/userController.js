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
    const { email, password, firstname, lastname, billing_address, role, account_status, is_subscribed } = req.body;

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user with all provided fields
    const user = await User.create({ 
      email, 
      password: hashedPassword,
      firstname,
      lastname,
      billing_address,
      role,
      account_status,
      is_subscribed
    });

    // Set up nodemailer transporter
    const transporter = createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      auth: {
        user: 'cinemaebook080@gmail.com',
        pass: 'yourSMTPpassword', // Use your actual SMTP password
      },
    });

    const emailText = `
      Thank you for creating an account with us, ${firstname}. We are happy that you get to be a part of the cinema-ebook family.
    `;

    const mailOptions = {
      from: 'cinemaebook080@gmail.com',
      to: user.email, // Use the user's email address
      subject: 'Welcome to Cinema eBook',
      text: emailText,
    };

    // Send the welcome email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

    // Respond with the created user information
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

module.exports = createUser;

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
    const { email, password } = req.body;

    // Find the user based on the provided email
    const user = await User.findOne({ where: { email } });

    // Step 2: Update the user's password in the database
    if (user) {
      const saltRounds = 10; // Adjust the number of salt rounds based on your security requirements
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      user.password = hashedPassword;
      await user.save();

      // You can return a success message or any other indication if needed
      return res.status(200).json({ success: true, message: 'Password updated successfully' });
    } else {
      // Handle case where user with the given email is not found
      return res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    // Handle any errors that may occur during the process
    console.error('Error in forgotPassword:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
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
  checkCode
};

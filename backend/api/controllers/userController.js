const User = require('../models/UserModel');
const PaymentInformation = require('../models/PaymentInformationModel');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');

const createUser = async (req, res) => {
  try {
    const { password, ...userData } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ ...userData, password: hashedPassword });

    res.status(201).json({
      message: 'User created successfully',
      user_id: user.user_id,
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
  const { email } = req.body;

  try {
    // Find the user by their email
    const user = await User.findOne({ email });

    if (!user) {
      // User with the provided email does not exist
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a unique token for password reset
    const resetToken = jwt.sign({ userId: user.user_id }, 'your-secret-key', {
      expiresIn: '1h',
    });

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

module.exports = {
  createUser,
  login,
  forgotPassword,
  editProfile,
  editPaymentMethod,
  getPaymentMethods,
  createPaymentMethod,
};

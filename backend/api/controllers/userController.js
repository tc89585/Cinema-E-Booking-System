const User = require('../models/UserModel');
const bcrypt = require('bcrypt');

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

//*TODO*
//const loginUser = ...

//*TODO*
//const editProfile = ...

module.exports = { createUser };

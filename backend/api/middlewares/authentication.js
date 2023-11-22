const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
  // Retrieve the token from the Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (token == null) {
    return res.sendStatus(401); // If no token is present, return an unauthorized status
  }

  jwt.verify(token, 'cinema', (err, user) => {
    if (err) {
      return res.sendStatus(403); // If token is not valid, return a forbidden status
    }

    // If token is valid, add the user info to the request object
    req.user = user;

    next(); // Proceed to the next middleware or route handler
  });
};

module.exports = authenticateUser;

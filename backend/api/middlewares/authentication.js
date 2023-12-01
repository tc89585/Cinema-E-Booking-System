const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (token == null) {
    return res.sendStatus(401); // No token present, unauthorized
  }

  jwt.verify(token, 'cinema', (err, user) => {
    if (err) {
      return res.sendStatus(403); // Token is invalid, forbidden
    }

    req.user = user;
    next(); // Proceed if token is valid
  });
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next(); // Proceed if user is an admin
  } else {
    res.status(403).send('Access denied: Admin role required'); // Forbidden if not an admin
  }
};

module.exports = {
  authenticateUser,
  isAdmin
};

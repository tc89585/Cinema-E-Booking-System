// simulateTokenGeneration.js

const jwt = require('jsonwebtoken');

const userId = 123; // Replace with a user's ID
const secretKey = 'your-secret-key'; // Replace with your application's actual secret key

const token = jwt.sign({ userId }, secretKey, { expiresIn: '1h' }); // Create a token with a 1-hour expiration

console.log(token);

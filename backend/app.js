const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const Movie = require('./api/models/MovieModel');
const userRouter = require('./api/routes/userRouter');
const movieRouter = require('./api/routes/movieRouter');
const sequelize = require('./database'); // Import the sequelize instance

dotenv.config();

app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:3000',
  })
);

app.use('/users', userRouter);
app.use('/movies', movieRouter);

const port = process.env.PORT || 8080;

sequelize
  .sync()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Error syncing the database:', err);
  });

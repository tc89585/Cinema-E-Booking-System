const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const Movie = require('./api/models/MovieModel');
const userRouter = require('./api/routes/userRouter');
const movieRouter = require('./api/routes/movieRouter');
const adminRouter = require('./api/routes/adminRouter');
const bookingRouter = require('./api/routes/bookingRouter');
const sequelize = require('./database'); // Import the sequelize instance
require('./api/models/Associations');

dotenv.config();

app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:3000',
  })
);
app.use('/admins', adminRouter);
app.use('/users', userRouter);
app.use('/movies', movieRouter);
app.use('/bookings', bookingRouter);

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

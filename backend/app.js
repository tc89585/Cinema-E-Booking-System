const express = require('express');
const app = express();
const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config();

app.use(express.json());

const port = process.env.PORT || 3000;

/*connect to database*/

const db = mysql.createConnection({
  host: 'cinema-db.cexoykt5nvcs.us-east-2.rds.amazonaws.com',
  port: '3306',
  user: 'admin',
  password: 'password',
  database: 'cinema_proj_db',
});

db.connect((err) => {
  if (err) {
    console.log(err);
  } else console.log('Database connected');
});

app.get('/movies', async (req, res) => {
  db.query('SELECT * FROM Movie', (err, results) => {
    if (err) {
      console.error(err);
    } else {
      console.log(results);
      res.json(results);
    }
  });
});

app.post('/createMovie', (req, res) => {
  const {
    title,
    category,
    cast,
    director,
    producer,
    synopsis,
    reviews,
    trailer_picture,
    trailer_video,
    mpaa_rating,
    show_date,
    show_time,
  } = req.body;

  const query = `INSERT INTO movie (title, category, cast, director, producer, synopsis, reviews, trailer_picture, trailer_video, mpaa_rating, show_date, show_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(
    query,
    [
      title,
      category,
      cast,
      director,
      producer,
      synopsis,
      reviews,
      trailer_picture,
      trailer_video,
      mpaa_rating,
      show_date,
      show_time,
    ],
    (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Error creating the movie' });
      } else {
        res.status(200).json({ message: 'Movie created successfully' });
      }
    }
  );
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

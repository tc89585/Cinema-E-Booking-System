import React, { useState, useEffect } from 'react';
import './book.css';
import Axios from 'axios';
import { useParams } from 'react-router-dom';

const Book = () => {
  const [movie, setMovie] = useState(null); // Initialize as null or an empty object
  const { movieId } = useParams();

  useEffect(() => {
    Axios.get(`http://localhost:8080/movies/getMovieById/${movieId}`)
      .then((response) => {
        setMovie(response.data);
      })
      .catch((error) => {
        console.error('Error fetching movie:', error);
      });
  }, [movieId]);

  if (!movie) {
    return <div>Loading...</div>;
  }

  return (
    <div className='book-container'>
      <h1>Movie Booking</h1>
      <img src={movie.poster_url} alt={movie.title} />

      <h2>{movie.title}</h2>
      <p>{movie.description}</p>

      <h3>Showtimes:</h3>
      <ul>
        {movie.timeSlots && movie.timeSlots.map((timeSlot) => (
          <li key={timeSlot.id}>{timeSlot.startTime}</li>
        ))}
      </ul>
      <button className="booking-button" type="button">
        Book Now
      </button>
    </div>
  );
};

export default Book;


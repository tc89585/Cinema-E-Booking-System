import React, { useState, useEffect } from 'react';
import './book.css';
import Axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import SelectSeats from './SelectSeats';

const Book = () => {
  const [movie, setMovie] = useState(null);
  const [showDate, setShowDate] = useState('');
  const [showtimes, setShowtimes] = useState([]);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const { movieId } = useParams();
  const navigate = useNavigate();

  const handleShowtimeSelect = (selectedShowtime) => {
    // Use navigate to redirect to the Select Seats page with the correct data
    navigate(`/selectseat/${selectedShowtime.showtime_id}`);
  };

  useEffect(() => {
    Axios.get(`http://localhost:8080/movies/getMovieById/${movieId}`)
      .then((response) => {
        setMovie(response.data);
      })
      .catch((error) => {
        console.error('Error fetching movie:', error);
      });
  }, [movieId]);

  useEffect(() => {
    if (movie && showDate) {
      Axios.get(`http://localhost:8080/bookings/getAvailableShowtimes/${movie.movie_id}/${showDate}`)
        .then((response) => {
          setShowtimes(response.data);
        })
        .catch((error) => {
          console.error('Error fetching showtimes:', error);
        });
    }
  }, [movie, showDate]);

  const handleDateChange = (event) => {
    setShowDate(event.target.value);
    setSelectedShowtime(null);
  };



  return (
    <div className='book-container'>
      <h1>Movie Booking</h1>
      
      {movie && (
        <>
          <img
            src={movie.poster_url}
            alt={movie.title}
            style={{ maxHeight: '400px', width: 'auto', marginBottom: '20px' }}
          />

          <h2>{movie.title}</h2>
          <p>{movie.description}</p>
        </>
      )}

      <div>
        <label htmlFor="datePicker">Select Date:</label>
        <input
          type="date"
          id="datePicker"
          onChange={handleDateChange}
          value={showDate}
        />
      </div>

      <h3>Showtimes:</h3>
      <div className="showtime-buttons">
        {showtimes.length > 0 ? (
          showtimes.map((timeSlot) => (
            <button
              key={timeSlot.showtime_id}
              className="showtime-button"
              type="button"
              onClick={() => handleShowtimeSelect(timeSlot)}
            >
              {timeSlot.show_time}
            </button>
          ))
        ) : (
          <div key={`no-showtimes-${showDate}`}>
            No available showtimes found for {showDate}
          </div>
        )}
      </div>

     

      {movie && (
        <div className="movie-details">
          <h3>Movie Details:</h3>
          <p><strong>Category:</strong> {movie.category}</p>
          <p><strong>Cast:</strong> {movie.cast}</p>
          <p><strong>Director:</strong> {movie.director}</p>
          <p><strong>Producer:</strong> {movie.producer}</p>
          <p><strong>Synopsis:</strong> {movie.synopsis}</p>
          <p><strong>MPAA Rating:</strong> {movie.mpaa_rating}</p>
        </div>
      )}

    </div>
  );
};

export default Book;

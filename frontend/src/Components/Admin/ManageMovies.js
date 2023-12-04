import React, { useState } from 'react';
import '../Styles/ManageMovies.css';
import { useAuth } from '../Context';

function ManageMovies() {
  const [movieData, setMovieData] = useState({
    title: '',
    synopsis: '',
    cast: '',
    director: '',
    producer: '',
    category: '',
    trailer_url: '',
    Poster_url: '',
    mpaa_rating: '',
    isCurrentlyShowing: false,
  });
  const [showtimeData, setShowtimeData] = useState({
    movie_id: '',
    show_date: '',
    show_time: '',
    duration: '',
  });
  const [message, setMessage] = useState('');
  const [showAddMovieForm, setShowAddMovieForm] = useState(false);
  const API_URL =
    process.env.REACT_APP_API_URL || 'http://localhost:8080/admins';
  const { token } = useAuth();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    if (name in movieData) {
      setMovieData({ ...movieData, [name]: newValue });
    } else if (name in showtimeData) {
      setShowtimeData({ ...showtimeData, [name]: newValue });
    }
  };

  const handleAddMovieClick = () => {
    setShowAddMovieForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/addMovie`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(movieData),
      });
      console.log({ movie: movieData });

      if (response.ok) {
        const data = await response.json();
        setMessage(data.message || 'Movie added successfully');
      } else {
        throw new Error('Failed to add movie');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage(error.message);
    }
  };

  const handleShowtimeSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/addShowtime`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(showtimeData),
      });

      if (response.ok) {
        const data = await response.json();
        // Handle success
      } else {
        throw new Error('Failed to add showtime');
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle error
    }
  };

  return (
    <div className="manage-movies-container">
      <h2>Add a Movie</h2>
      <button onClick={handleAddMovieClick} className="add-movie-button">
        Add Movie
      </button>
      {showAddMovieForm && (
        <form onSubmit={handleSubmit} className="movie-form">
          <div className="form-group">
            <label>Title:</label>
            <input
              type="text"
              name="title"
              value={movieData.title}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Description:</label>
            <textarea
              name="synopsis"
              value={movieData.synopsis}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Cast:</label>
            <input
              type="text"
              name="cast"
              value={movieData.cast}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Director:</label>
            <input
              type="text"
              name="director"
              value={movieData.director}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Producer:</label>
            <input
              type="text"
              name="producer"
              value={movieData.producer}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Rating:</label>
            <input
              type="text"
              name="mpaa_rating"
              value={movieData.mpaa_rating}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Genre:</label>
            <input
              type="text"
              name="category"
              value={movieData.category}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Trailer URL:</label>
            <input
              type="url"
              name="trailer_url"
              value={movieData.trailer_url}
              onChange={handleInputChange}
              src={movieData.trailer_url}
              required
            />
          </div>
          <div className="form-group">
            <label>Poster:</label>
            <input
              type="url"
              name="Poster_url"
              value={movieData.Poster_url}
              onChange={handleInputChange}
              src={movieData.Poster_url}
              required
            />
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="isCurrentlyShowing"
                checked={movieData.isCurrentlyShowing}
                onChange={handleInputChange}
              />
              Currently Showing
            </label>
          </div>
          <button type="submit" className="submit-button">
            Submit Movie
          </button>
        </form>
      )}
      {message && <p className="success-message">{message}</p>}
    </div>
  );
}

export default ManageMovies;

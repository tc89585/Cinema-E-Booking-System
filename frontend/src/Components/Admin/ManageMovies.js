import React, { useState } from "react";
import "../Styles/ManageMovies.css";
import { useAuth } from "../Context";

function ManageMovies() {
  const [movieData, setMovieData] = useState({
    movie_id: "",
    title: "",
    synopsis: "",
    cast: "",
    director: "",
    producer: "",
    category: "",
    trailer_url: "",
    Poster_url: "",
    mpaa_rating: "",
    isCurrentlyShowing: false,
  });
  const [message, setMessage] = useState("");
  const [showAddMovieForm, setShowAddMovieForm] = useState(false);
  const [movieIdToDelete, setMovieIdToDelete] = useState("");
  const [movieIdToFetch, setMovieIdToFetch] = useState('');
const [fetchedMovie, setFetchedMovie] = useState(null);

  const API_URL =
    process.env.REACT_APP_API_URL || "http://localhost:8080/admins";
    const API_URL1 =
    process.env.REACT_APP_API_URL || "http://localhost:8080/movies";
  const { token } = useAuth();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    if (name in movieData) {
      setMovieData({ ...movieData, [name]: newValue });
    } 
  };

  const handleAddMovieClick = () => {
    setShowAddMovieForm(true);
  };
  const fetchMovieById = async (id) => {
    try {
      const response = await fetch(`${API_URL1}/getMovieById/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        const movie = await response.json();
        setMovieData(movie); // Set the movie data directly
      } else {
        throw new Error('Failed to fetch movie');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage(error.message);
    }
  };
  

  const handleEditMoviesClick = () => {
    fetchMovieById();
  };
  const handleSubmitAdd = async (e) => {
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

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
  
    const requestData = {
      movieId: movieData.movie_id,
      updateData: { ...movieData }
    };
  
    try {
      const response = await fetch(`${API_URL}/updateMovieInfo`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });
  
      // ... handle the response ...
    } catch (error) {
      // ... handle the error ...
    }
  };
  
  

  const deleteMovie = async (id) => {
    if (!id) {
      alert("Please enter a movie ID");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/deleteMovie/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMessage("Movie deleted successfully");
        // Optionally, clear the input field after successful deletion
        setMovieIdToDelete("");
      } else {
        throw new Error("Failed to delete movie");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage(error.message);
    }
  };

  return (
    <div className="manage-movies-container">
      <div className="fetch-movie-container">
        <input
          type="text"
          placeholder="Enter Movie ID"
          value={movieIdToFetch}
          onChange={(e) => setMovieIdToFetch(e.target.value)}
        />
        <button onClick={() => fetchMovieById(movieIdToFetch)}>
          Edit Movie
        </button>
      </div>
  
      {/* Form for Editing Movie */}
      <h2>Edit Movie</h2>
      <form onSubmit={handleSubmitUpdate} className="movie-form">
        {/* All your form fields go here, bound to movieData */}
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
          <label>Synopsis:</label>
          <input
            type="text"
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
          <label>Category:</label>
          <input
            type="text"
            name="category"
            value={movieData.category}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Trailer:</label>
          <input
            type="text"
            name="trailer_url"
            value={movieData.trailer_url}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Poster:</label>
          <input
            type="text"
            name="Poster_url"
            value={movieData.Poster_url}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Mpaa:</label>
          <input
            type="text"
            name="mpaa_rating"
            value={movieData.mpaa_rating}
            onChange={handleInputChange}
            required
          />
        </div>
        {/* ... */}
        <button type="submit" className="submit-button">
          Submit Changes
        </button>
      </form>
      <h2>Add a Movie</h2>
      <button onClick={handleAddMovieClick} className="add-movie-button">
        Add Movie
      </button>
      {showAddMovieForm && (
        <form onSubmit={handleSubmitAdd} className="movie-form">
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
          <div className="delete-movie-container">
            <input
              type="text"
              placeholder="Enter Movie ID"
              value={movieIdToDelete}
              onChange={(e) => setMovieIdToDelete(e.target.value)}
            />
            <button onClick={() => deleteMovie(movieIdToDelete)}>
              Delete Movie
            </button>
          </div>
        </form>
      )}
      {message && <p className="success-message">{message}</p>}
    </div>
  );
}

export default ManageMovies;

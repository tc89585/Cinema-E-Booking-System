import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import './home.css';
import Book from './Book';
import Banner from './Banner';
import { useNavigate } from "react-router-dom";;

function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showingNow, setShowingNow] = useState(true);
  const [movies, setMovies] = useState([]);

  const navigate = useNavigate();


  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  
const handleMovieClick = (movie) => {
  setSelectedMovie(movie);
  navigate(`/book/${movie.movie_id}`); // Navigate to the booking page with movie ID
};

  useEffect(() => {
    // Make a GET request to fetch movies from your backend
    Axios.get('http://localhost:8080/movies')
      .then((response) => {
        // Handle the response data by setting it to the state
        setMovies(response.data);
      })
      .catch((error) => {
        console.error('Error fetching movies:', error);
      });
  }, []);

  const filteredMovies = movies.filter(
    (movie) =>
      movie.title &&
      movie.title.toLowerCase().includes(searchQuery) &&
      (showingNow ? movie.isCurrentlyShowing : !movie.isCurrentlyShowing)
  );

  return (
    <div className="home">
      <div className="banner-container">
        <Banner searchQuery={searchQuery} handleSearch={handleSearch} />
        <div className="toggle-button">
          <button onClick={() => setShowingNow(true)}>Currently Showing</button>
          <button onClick={() => setShowingNow(false)}>Coming Soon</button>
        </div>
      </div>
<div className="card-list">
  {filteredMovies.map((movie, index) => (
    <div key={index} className="card">
      {/* Make the title clickable */}
      <h2 onClick={() => handleMovieClick(movie)} style={{ cursor: 'pointer' }}>
        {movie.title}
      </h2>
      <iframe
        title={movie.title}
        src={movie.trailer_url}
        frameBorder="0"
        allowFullScreen
        width="640"
        height="360"
        style={{ display: 'block' }}
      ></iframe>

      {showingNow && (
        <button
          className="book-button"
          onClick={() => handleMovieClick(movie)}
        >
          Get Tickets
        </button>
      )}
    </div>
  ))}
</div>

      {selectedMovie && <Book selectedMovie={selectedMovie} />}
    </div>
  );
}

export default Home;

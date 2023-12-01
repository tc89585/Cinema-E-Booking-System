import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import './home.css';
import Book from './Book';
import Banner from './Banner';

function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showingNow, setShowingNow] = useState(true);
  const [movies, setMovies] = useState([]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleLogin = () => {
    window.location.href = 'http://localhost:3000/login';
  };

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
    if (showingNow) {
      // Handle the navigation to the booking page or any other action you want.
    }
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

  const filteredMovies = movies.filter((movie) =>
  (movie.title && movie.title.toLowerCase().includes(searchQuery)) &&
  (showingNow ? movie.isCurrentlyShowing : !movie.isCurrentlyShowing)
);


return (
  <div className="home">
    <div className="banner-container">
      <Banner
        isLoggedIn={isLoggedIn}
        handleLogin={handleLogin}
        searchQuery={searchQuery}
        handleSearch={handleSearch}
        setIsLoggedIn={setIsLoggedIn}
      />
      <div className="toggle-button">
        <button onClick={() => setShowingNow(true)}>Currently Showing</button>
        <button onClick={() => setShowingNow(false)}>Coming Soon</button>
      </div>
    </div>
    <div className="card-list">
      {filteredMovies.map((movie, index) => (
        <div key={index} className="card">
          <h2>{movie.title}</h2>
          <iframe
            title={movie.title}
            src={movie.trailer_url}
            frameBorder="0"
            allowFullScreen
            width="640" // Set an explicit width
            height="360" // Set an explicit height
            style={{ display: "block" }} // Ensure it's set to 'block' for visibility
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
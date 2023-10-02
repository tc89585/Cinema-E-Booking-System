import React, { useState } from 'react';
import './home.css';
import Book from './Book';
import Banner from './Banner';
function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleLogin = () => {
    // Implement your login logic here.
    setIsLoggedIn(true);
  };
  
  const handleMovieClick = (movie) => {
    setSelectedMovie(movie); // Set the selected movie
  };


  const movieTrailers = [
    {
      title: 'Movie 1',
      trailerUrl: 'https://www.youtube.com/embed/VIDEO_ID_1',
    },
    {
      title: 'Movie 2',
      trailerUrl: 'https://www.youtube.com/embed/VIDEO_ID_2',
    },
    {
  title: 'Aquaman',
  trailerUrl: 'https://www.youtube.com/embed/FV3bqvOHRQo?si=8qm8K4n3GEQrd4l2'
    },
    {
      title: 'memories of a murder',
      trailerUrl: 'https://www.youtube.com/embed/0n_HQwQU8ls?si=MdL4zb24MCf7Maoy'
    },
{
    title: 'Past lives',
    trailerUrl: 'https://www.youtube.com/embed/kA244xewjcI?si=ckSAx93cnLEMDQqO'
},
{
    title: 'Oppenheimer',
    trailerUrl: 'https://www.youtube.com/embed/uYPbbksJxIg'
}
  ];
  

  const filteredTrailers = movieTrailers.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <div className="home">
      <Banner
        isLoggedIn={isLoggedIn}
        handleLogin={handleLogin}
        searchQuery={searchQuery}
        handleSearch={handleSearch}
        setIsLoggedIn={setIsLoggedIn}
      />
      <div className="card-list">
        {filteredTrailers.map((movie, index) => (
          <div key={index} className="card">
            <h2>{movie.title}</h2>
            <iframe
              title={movie.title}
              src={movie.trailerUrl}
              frameBorder="0"
              allowFullScreen
            ></iframe>
            <button className="book-button" 
            onClick={() => {
              window.location.href = 'http://localhost:3000/book';
              handleMovieClick(movie);
            }}>Get Tickets</button>
          </div>
        ))}
      </div>
      <Book selectedMovie={selectedMovie} />
      </div>
  );
}

export default Home;

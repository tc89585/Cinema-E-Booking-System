import React from 'react';
import './home.css'

// Sample data for movie trailers
const movieTrailers = [
  {
    title: 'Movie 1',
    trailerUrl: 'https://www.youtube.com/embed/trailer1',
  },
  {
    title: 'Movie 2',
    trailerUrl: 'https://www.youtube.com/embed/trailer2',
  },
  {
    title: 'Movie 3',
    trailerUrl: 'https://www.youtube.com/embed/trailer3',
  },
  // Add more movie data here
];

function Home() {
  return (
    <div className="home">
      <h1>Movie Trailers</h1>
      <div className="grid-container">
        {movieTrailers.map((movie, index) => (
          <div key={index} className="grid-item">
            <h2>{movie.title}</h2>
            <iframe
              title={movie.title}
              width="560"
              height="315"
              src={movie.trailerUrl}
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;

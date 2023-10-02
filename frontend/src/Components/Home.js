import React, { useState } from 'react';
import './home.css';
import Book from './Book';
import Banner from './Banner';
function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const[showingNow, setShowingNow] = useState(true);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleLogin = () => {
    window.location.href = 'http://localhost:3000/login';
    setIsLoggedIn(false);
  };
  
  const handleMovieClick = (movie) => {
    setSelectedMovie(movie); 
    if(showingNow) {
        window.location.href=  window.location.href = `http://localhost:3000/book?movie=${encodeURIComponent(JSON.stringify(movie))}`;;
    }
  };


  const movieTrailers = [
    {
      title: 'Instellar',
      trailerUrl: 'https://www.youtube.com/embed/zSWdZVtXT7E?si=19pf7lIKLtscy-9M',
      isCurrentlyShowing: true,
    },
    {
      title: 'Inception',
      trailerUrl: 'https://www.youtube.com/embed/YoHD9XEInc0?si=ISmp8J5614EN3piD',
      isCurrentlyShowing: true,
    },
    {
  title: 'Aquaman',
  trailerUrl: 'https://www.youtube.com/embed/FV3bqvOHRQo?si=8qm8K4n3GEQrd4l2',
  isCurrentlyShowing: true,
    },
    {
      title: 'Memories of Murder',
      trailerUrl: 'https://www.youtube.com/embed/0n_HQwQU8ls?si=MdL4zb24MCf7Maoy',
      isCurrentlyShowing: true,
    },
{
    title: 'Past lives',
    trailerUrl: 'https://www.youtube.com/embed/kA244xewjcI?si=ckSAx93cnLEMDQqO',
    isCurrentlyShowing: true,
},
{
    title: 'Oppenheimer',
    trailerUrl: 'https://www.youtube.com/embed/uYPbbksJxIg',
    isCurrentlyShowing: true,
},
{
    title: 'Movie 3',
    trailerUrl: 'https://www.youtube.com/embed/VIDEO_ID_1',
    isCurrentlyShowing: false,
  }, 
  {
    title: 'Movie 4',
    trailerUrl: 'https://www.youtube.com/embed/VIDEO_ID_1',
    isCurrentlyShowing: false,
  },
  {
    title: 'Movie 5',
    trailerUrl: 'https://www.youtube.com/embed/VIDEO_ID_1',
    isCurrentlyShowing: false,
  },
  {
    title: 'Movie 6',
    trailerUrl: 'https://www.youtube.com/embed/VIDEO_ID_1',
    isCurrentlyShowing: false,
  },
  {
    title: 'Movie 7',
    trailerUrl: 'https://www.youtube.com/embed/VIDEO_ID_1',
    isCurrentlyShowing: false,
  },
  {
    title: 'Movie 8',
    trailerUrl: 'https://www.youtube.com/embed/VIDEO_ID_1',
    isCurrentlyShowing: false,
  },
  ];
  


  const filteredTrailers = movieTrailers.filter((movie) =>
  movie.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
  (showingNow ? movie.isCurrentlyShowing : !movie.isCurrentlyShowing)
  );
  if (filteredTrailers.length > 0) {
    const selectedMovie = filteredTrailers[0];
    const posterUrl = selectedMovie.posterUrl;
  } else {
    // Handle the case where there are no movies that match the search criteria.
  }
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
        {filteredTrailers.map((movie, index) => (
          <div key={index} className="card">
            <h2>{movie.title}</h2>
            <iframe
              title={movie.title}
              src={movie.trailerUrl}
              frameBorder="0"
              allowFullScreen
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
      {selectedMovie && <Book selectedMovie={selectedMovie}/>}
      </div>
  );
}

export default Home;

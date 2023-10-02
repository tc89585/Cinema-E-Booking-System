import React from "react";

const Book = () => {
  const [movie, setMovie] = React.useState(null);

  const handleMovieClick = (movie) => {
    setMovie(movie);
  };

  if (!movie) {
    return <div>Please select a movie.</div>;
  }

  return (
    <div>
      <h1>Movie Booking</h1>

      <img src={movie.posterUrl} alt={movie.title} />

      <ul>
        {movie.timeSlots.map((timeSlot) => (
          <li key={timeSlot.id}>{timeSlot.startTime}</li>
        ))}
      </ul>

      <p>{movie.description}</p>

      <button type="button">Book Now</button>
    </div>
  );
};

export default Book;
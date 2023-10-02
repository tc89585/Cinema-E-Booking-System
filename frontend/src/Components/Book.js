import React from 'react';
import './book.css'
const Book = () => {
  const movieData = [
    {
      title: 'Oppenheimer',
      posterUrl: 'https://m.media-amazon.com/images/I/71xDtUSyAKL._AC_UF894,1000_QL80_.jpg',
      description:
        "During World War II, Lt. Gen. Leslie Groves Jr. appoints physicist J. Robert Oppenheimer to work on the top-secret Manhattan Project...",
      isCurrentlyShowing: true,
      timeSlots: [
        { id: 1, startTime: '10:00 AM' },
        { id: 2, startTime: '1:00 PM' },
        { id: 3, startTime: '4:00 PM' },
      ],
    },
  ];

  const selectedMovie = movieData[0]; // Select a movie from movieData

  if (!selectedMovie) {
    return <div>Please select a movie.</div>;
  }

  return (
    <div className='book-container'>
      <h1>Movie Booking</h1>
      <img src={selectedMovie.posterUrl} alt={selectedMovie.title} />

      <h2>{selectedMovie.title}</h2>
      <p>{selectedMovie.description}</p>

      <h3>Showtimes:</h3>
      <ul>
        {selectedMovie.timeSlots.map((timeSlot) => (
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

import React from 'react';
import { Link } from 'react-router-dom';
import "./Showtimes.css";
 

const MovieSchedule = () => {
    const movieDates = [
      { date: 'Friday, December 1', times: ['3pm', '6pm', '9pm'] },
      { date: 'Saturday, December 2', times: ['4pm', '6pm', '9pm'] }
      // Add more movie dates as needed
    ];
  
    return (
      <div>
        {movieDates.map((movie, index) => (
          <div key={index}>
            <h2>{movie.date}</h2>
            {movie.times.map((time, timeIndex) => (
              <div key={timeIndex}>
                {timeIndex === 0 && (
                  <Link to={`/select-seats/${movie.date}/${time}`}>
                    <button>{time}</button>
                  </Link>
                )}
                {timeIndex !== 0 && <span>{time}</span>}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };
  
  export default MovieSchedule;
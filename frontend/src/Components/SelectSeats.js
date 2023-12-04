import React, { useState, useEffect } from 'react';
import './SelectSeats.css';
import Axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const SelectSeats = () => {
  const { showtimeId } = useParams();
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState(new Set());

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const response = await Axios.get(`http://localhost:8080/bookings/getSeatsForShowtime/${showtimeId}`);
        setSeats(response.data);
      } catch (error) {
        console.error('Error fetching seats:', error);
      }
    };

    fetchSeats();
  }, [showtimeId]);

  const toggleSeatSelection = (seatId) => {
    const newSelection = new Set(selectedSeats);
    if (newSelection.has(seatId)) {
      newSelection.delete(seatId);
    } else {
      newSelection.add(seatId);
    }
    setSelectedSeats(newSelection);
  };

  const confirmSelection = () => {};

  const cancelSelection = () => {
    setSelectedSeats(new Set());
  };

  const isSeatBooked = (seatId) => {
    return seats.find((seat) => seat.seat_id === seatId && seat.is_booked);
  };

  const generateSeats = () => {
    return (
      <div className="seat-selector">
        {seats.map((seat) => {
          const seatId = seat.seat_id;
          const isBooked = seat.is_booked;
          const isSeatSelected = selectedSeats.has(seatId);
          const seatClassName = `seat ${isSeatSelected ? 'selected' : ''} ${isBooked ? 'booked' : ''}`;

          return (
            <button
              key={seatId}
              className={seatClassName}
              onClick={() => !isBooked && toggleSeatSelection(seatId)}
              disabled={isBooked}
            >
              {seat.seat_number}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="seat-selection-container">
      <div className="theater-screen"></div>
      {generateSeats()}
      <div className="selection-summary">
        <div>
          <h3>{selectedSeats.size} Seats Selected:</h3>
          <p>Seats: {Array.from(selectedSeats).join(', ')}</p>
        </div>
        <div className="selection-buttons">
          <button className="confirm" onClick={confirmSelection} disabled={selectedSeats.size === 0}>
            Confirm
          </button>
          <button className="cancel" onClick={cancelSelection}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectSeats;

import React, { useState } from 'react';
import './SelectSeats.css'; // Make sure to create a corresponding CSS file for styling

const SelectSeats = () => {
  // Represents the rows and seats in each row
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const seatsPerRow = 14;

  // State to track selected seats
  const [selectedSeats, setSelectedSeats] = useState(new Set());

  // Function to handle seat selection
  const toggleSeatSelection = (seatId) => {
    const newSelection = new Set(selectedSeats);
    if (newSelection.has(seatId)) {
      newSelection.delete(seatId);
    } else {
      newSelection.add(seatId);
    }
    setSelectedSeats(newSelection);
  };

  // Function to handle confirmation of seat selection
  const confirmSelection = () => {
    // Handle the logic to confirm the seat selection here
    console.log('Confirmed seats:', Array.from(selectedSeats));
  };

  // Function to handle cancellation of seat selection
  const cancelSelection = () => {
    setSelectedSeats(new Set()); // Clears the selection
  };

  // Function to generate seat elements
  const generateSeats = () => {
    return rows.map((row) => (
      <div key={row} className="row">
        {[...Array(seatsPerRow).keys()].map((seat) => {
          const seatId = `${row}${seat + 1}`;
          return (
            <button
              key={seatId}
              className={`seat ${selectedSeats.has(seatId) ? 'selected' : ''}`}
              onClick={() => toggleSeatSelection(seatId)}
            >
              {seatId}
            </button>
          );
        })}
      </div>
    ));
  };

  return (
    <div className="seat-selection-container">
      <div className="seat-selector">{generateSeats()}</div>
      <div className="selection-summary">
        <div>
          <h3>{selectedSeats.size} Seats Selected:</h3>
          <p>Seats: {Array.from(selectedSeats).join(', ')}</p>
        </div>
        <div className="selection-buttons">
          <button className="confirm" onClick={confirmSelection}>Confirm</button>
          <button className="cancel" onClick={cancelSelection}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default SelectSeats;
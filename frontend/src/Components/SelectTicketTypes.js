import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import './SelectTicketTypes.css';
import { useNavigate } from 'react-router-dom';

const SelectTicketTypes = ({ selectedSeats, showtimeId, userId }) => {
  const [ticketTypes, setTicketTypes] = useState([]);
  const [selectedTickets, setSelectedTickets] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTicketPrices = async () => {
      try {
        const response = await Axios.get(
          'http://localhost:8080/bookings/getTicketPrice'
        );
        setTicketTypes(response.data);
      } catch (error) {
        console.error('Error fetching ticket prices:', error);
      }
    };

    fetchTicketPrices();
  }, []);

  const handleTicketChange = (type, increment) => {
    const currentCount = selectedTickets[type] || 0;
    const newCount = increment
      ? currentCount + 1
      : Math.max(currentCount - 1, 0);
    if (
      newCount + totalSelectedTickets() - currentCount <=
      selectedSeats.size
    ) {
      setSelectedTickets({ ...selectedTickets, [type]: newCount });
    }
  };

  const calculateTotalPrice = () => {
    return ticketTypes.reduce((total, ticketType) => {
      const count = selectedTickets[ticketType.ticket_type] || 0;
      return total + count * ticketType.ticket_price;
    }, 0);
  };

  const totalSelectedTickets = () => {
    return Object.values(selectedTickets).reduce(
      (total, count) => total + count,
      0
    );
  };

  return (
    <div className="ticket-selection-container">
      {ticketTypes.map((ticketType) => (
        <div key={ticketType.ticket_type} className="ticket-type">
          <div className="type-info">
            <p>{ticketType.ticket_type}</p>
            <p>${(ticketType.ticket_price || 0).toFixed(2)}</p>
          </div>
          <div className="type-selector">
            <button
              onClick={() => handleTicketChange(ticketType.ticket_type, false)}
            >
              -
            </button>
            <span>{selectedTickets[ticketType.ticket_type] || 0}</span>
            <button
              onClick={() => handleTicketChange(ticketType.ticket_type, true)}
            >
              +
            </button>
          </div>
        </div>
      ))}

      {console.log('these are the selected Seats: ', selectedSeats)}
      <button
        className="proceed-button"
        onClick={() => {
          const totalPrice = calculateTotalPrice();
          navigate('/checkout', {
            state: {
              totalPrice,
              selectedSeats: Array.from(selectedSeats),
              selectedTickets,
              showtimeId,
              userId,
            },
          });
        }}
        disabled={totalSelectedTickets() !== selectedSeats.size}
      >
        Proceed to Payment
      </button>
    </div>
  );
};

export default SelectTicketTypes;

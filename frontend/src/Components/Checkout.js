import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useAuth } from './Context';
import './checkout.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Checkout = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [cardDetails, setCardDetails] = useState({
    card_type: '',
    card_number: '',
    expiration_date: '',
  });
  const { token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { totalPrice, selectedSeats, selectedTickets, showtimeId, userId } =
    location.state || {};
  const [discountCode, setDiscountCode] = useState('');
  const [discountedTotal, setDiscountedTotal] = useState(totalPrice);
  const [error, setError] = useState('');

  const fetchPaymentMethods = () => {
    Axios.get(`http://localhost:8080/users/payment-methods`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        setPaymentMethods(response.data);
      })
      .catch((error) => {
        console.error('Error fetching payment methods:', error);
      });
  };

  useEffect(() => {
    fetchPaymentMethods();
  }, [userId]);

  const handlePaymentMethodChange = (event) => {
    const methodId = event.target.value;
    setSelectedPaymentMethod(methodId);

    const selectedMethod = paymentMethods.find(
      (method) => method.payment_id.toString() === methodId
    );
    if (selectedMethod) {
      setCardDetails({
        card_type: selectedMethod.card_type,
        card_number: selectedMethod.card_number,
        expiration_date: selectedMethod.expiration_date,
      });
    } else {
      // Reset card details if 'new' is selected or no method is found
      setCardDetails({ card_type: '', card_number: '', expiration_date: '' });
    }
  };

  const handleCardDetailChange = (event) => {
    setCardDetails({
      ...cardDetails,
      [event.target.name]: event.target.value,
    });
  };

  const handleAddNewCard = () => {
    console.log('adding NEW card with details: ', cardDetails);
    if (paymentMethods.length >= 3) {
      setError('You cannot have more than 3 payment methods.');
      return;
    }
    Axios.post(`http://localhost:8080/users/payment-methods`, cardDetails, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        fetchPaymentMethods(); // Refresh the list of payment methods
      })
      .catch((error) => {
        console.error('Error adding new card:', error);
        setError('Error adding new card.');
        // Handle error response
      });
  };

  const handleApplyDiscount = () => {
    Axios.get(
      `http://localhost:8080/bookings/getDiscountRateByDescription/${discountCode}`
    )
      .then((response) => {
        // discountRate is now an integer representing the amount to subtract
        const discountAmount = parseInt(response.data.discountRate, 10);

        console.log(
          'Total Price:',
          totalPrice,
          'Discount Amount:',
          discountAmount
        );

        if (isNaN(totalPrice) || isNaN(discountAmount)) {
          console.error('Invalid total price or discount amount');
          // Optionally set an error message in state to display to the user
          return;
        }

        const newDiscountedTotal = totalPrice - discountAmount;
        setDiscountedTotal(Math.max(0, newDiscountedTotal)); // Ensure total doesn't go below 0
      })
      .catch((error) => {
        console.error('Error applying discount:', error);
      });
  };

  const handleSubmit = () => {
    // Create an array to store the mapping of seats to ticket types
    let seatsAndTickets = [];

    // Temporary array to hold the seat IDs that have been processed
    let processedSeatIds = [];

    // Iterate over each ticket type and its count
    Object.keys(selectedTickets).forEach((ticketType) => {
      for (let i = 0; i < selectedTickets[ticketType]; i++) {
        // Find the first unprocessed seat ID
        const seatId = selectedSeats.find(
          (id) => !processedSeatIds.includes(id)
        );

        if (seatId) {
          // Add the seat and ticket type to the array
          seatsAndTickets.push({ seat_id: seatId, ticket_type: ticketType });

          // Mark this seat ID as processed
          processedSeatIds.push(seatId);
        }
      }
    });

    console.log('Seats and Tickets:', seatsAndTickets);

    // Prepare booking data
    const bookingData = {
      user_id: userId,
      showtime_id: showtimeId,
      booking_date: new Date().toISOString().split('T')[0],
      total_price: discountedTotal,
      seatsAndTickets,
    };

    // Make POST request to /createBooking with bookingData
    Axios.post('http://localhost:8080/bookings/createBooking', bookingData, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((bookingResponse) => {
        console.log('Booking successful:', bookingResponse.data);
        navigate('/order-confirmation', {
          state: { ...bookingData, seatsAndTickets },
        });
      })
      .catch((bookingError) => {
        console.error('Booking failed:', bookingError);
        // Handle booking error
      });
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <p>Total Price: ${totalPrice ? totalPrice.toFixed(2) : '0.00'}</p>
      <input
        type="text"
        value={discountCode}
        onChange={(e) => setDiscountCode(e.target.value)}
        placeholder="Discount Code"
      />
      <button onClick={handleApplyDiscount}>Apply Discount</button>
      <p>Discounted Total: ${discountedTotal.toFixed(2)}</p>
      <div className="checkout-form">
        <select
          value={selectedPaymentMethod}
          onChange={handlePaymentMethodChange}
        >
          {paymentMethods.map((method) => (
            <option key={method.payment_id} value={method.payment_id}>
              {method.card_type} - ****{method.card_number.slice(-4)}
            </option>
          ))}
          <option value="new">Use a new card</option>
        </select>

        <div className="card-details">
          <input
            name="card_type"
            value={cardDetails.card_type}
            onChange={handleCardDetailChange}
            placeholder="Card Type"
          />
          <input
            name="card_number"
            value={cardDetails.card_number}
            onChange={handleCardDetailChange}
            placeholder="Card Number"
          />
          <input
            name="expiration_date"
            value={cardDetails.expiration_date}
            onChange={handleCardDetailChange}
            placeholder="Expiration Date"
            type="date"
          />
        </div>

        {error && <p className="error-message">{error}</p>}
        <button onClick={handleAddNewCard}>Add New Card</button>
        <button onClick={handleSubmit}>Submit Payment</button>
        <button onClick={() => navigate(-1)}>Back</button>
      </div>
    </div>
  );
};

export default Checkout;

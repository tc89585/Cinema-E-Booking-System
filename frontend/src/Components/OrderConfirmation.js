import { useLocation } from 'react-router-dom';

const OrderConfirmation = () => {
  const location = useLocation();
  const bookingData = location.state;
  const seats = location.state?.selectedSeats || []; // Provide a default empty array

  // Now, it's safe to use 'join' as 'seats' is guaranteed to be an array
  const seatNumbers = seats.join(', ');

  return (
    <div>
      <h1>Order Confirmation</h1>
      {bookingData && (
        <div>
          {/* Display booking details here using bookingData */}
          <p>Total Price: {bookingData.total_price}</p>
          <p>Showtime ID: {bookingData.showtime_id}</p>
          <p>User ID: {bookingData.user_id}</p>
          <p>Seats: {seatNumbers}</p>
        </div>
      )}
    </div>
  );
};

export default OrderConfirmation;

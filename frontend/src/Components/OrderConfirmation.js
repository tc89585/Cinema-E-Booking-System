import { useLocation } from 'react-router-dom';

const OrderConfirmation = () => {
  const location = useLocation();
  const bookingData = location.state;

  return (
    <div>
      <h1>Order Confirmation</h1>
      {bookingData && (
        <div>
          {/* Display booking details here using bookingData */}
          <p>Total Price: {bookingData.totalPrice}</p>
          <p>Showtime ID: {bookingData.showtimeId}</p>
          <p>User ID: {bookingData.userId}</p>
          <p>Seats: {bookingData.selectedSeats.join(', ')}</p>
        </div>
      )}
    </div>
  );
};

export default OrderConfirmation;

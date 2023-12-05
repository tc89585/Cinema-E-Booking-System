import { useLocation, Link } from 'react-router-dom';
import './OrderConfirmation.css';
 

const OrderConfirmation = () => {
  const location = useLocation();
  const { seatsAndTickets, total_price, showtime_id, user_id } =
    location.state || {};

  const seatNumbers = seatsAndTickets
    ? seatsAndTickets
        .map(
          (seatTicket) =>
            `Seat ${seatTicket.seat_id} (${seatTicket.ticket_type})`
        )
        .join(', ')
    : 'No seats selected';

  return (
    <div className="order-confirmation-container">
      <h1 className="order-confirmation-title">Order Confirmation</h1>
      <div className="order-confirmation-details">
        <p>
          <strong>Total Price:</strong> ${total_price}
        </p>
        <p>
          <strong>Showtime ID:</strong> {showtime_id}
        </p>
        <p>
          <strong>User ID:</strong> {user_id}
        </p>
        <p>
          <strong>Seats:</strong> {seatNumbers}
        </p>
      </div>
      <div className="back-to-home">
        <Link to="/">Back to Homepage</Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;

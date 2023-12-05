import React, { useState, useEffect } from 'react';
import { useAuth } from '../Context'
import axios from 'axios';
import '../Styles/ManageShowtimes.css'

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [userUpdates, setUserUpdates] = useState({});
  const [StatusMessage, setStatusMessage] = useState('');
  const { token } = useAuth();
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/admins";
  const API_URL1 = process.env.REACT_APP_API_URL || "http://localhost:8080/booking";
  const [ticketTypes, setTicketTypes] = useState([]);
  const [newTicketPrice, setNewTicketPrice] = useState('');
  const [selectedTicketType, setSelectedTicketType] = useState('');


  useEffect(() => {
    // Fetch users when the component mounts
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${API_URL}/getAllUsers`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUsers(data);
          // Initialize userUpdates state
          let updates = {};
          data.forEach(user => {
            updates[user.email] = user.account_status;
          });
          setUserUpdates(updates);
        } else {
          console.error('Failed to fetch users');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchUsers();
  }, [API_URL]);

  const handleStatusChange = (email, status) => {
    setUserUpdates(prev => ({ ...prev, [email]: status }));
  };
  const handleTicketTypeChange = (e) => {
    setSelectedTicketType(e.target.value);
  };
  
  const handleNewTicketPriceChange = (e) => {
    setNewTicketPrice(e.target.value);
  };

  const fetchTicketPrices = () => {
    axios.get(`${API_URL1}/getTicketPrice`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      setTicketTypes(response.data);
    })
    .catch(error => {
      console.error('Error fetching ticket prices:', error);
    });
  };
  

  const handleEditTicketPrice = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch(`${API_URL}/editTicketPrice`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ticket_type: selectedTicketType,
          ticket_price: parseFloat(newTicketPrice), // Assuming ticket_price is a numeric value
        }),
      });
  
      if (response.status === 200) {
        // Ticket price updated successfully
        // You can display a success message or update the UI accordingly
      } else if (response.status === 404) {
        // Ticket type not found
        // Display an error message or handle it as needed
      } else {
        // Handle other error cases
      }
    } catch (error) {
      // Handle network or server errors
    }
  };
  


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    setStatusMessage('Updating user statuses...');
  
    const updatePromises = Object.entries(userUpdates).map(async ([email, status]) => {
      try {
        const response = await fetch(`${API_URL}/manageUser/${email}/${status}`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
  
        if (!response.ok) {
          throw new Error(`Failed to update status for ${email}`);
        }
      } catch (error) {
        console.error('Error:', error);
        throw error; // Rethrow to be caught by Promise.all
      }
    });
  
    try {
      await Promise.all(updatePromises);
      setStatusMessage('All user statuses updated successfully');
    } catch (error) {
      setStatusMessage('An error occurred while updating user statuses');
    }
  };
  

  return (
    <div className="manage-showtimes-container">
      <h2>Manage Users</h2>
      <form onSubmit={handleSubmit}>
        {users.map((user) => (
          <div className="form-group" key={user.email}>
            <span>{user.email}: </span>
            <label>
              <input
                type="radio"
                name={user.email}
                value="active"
                checked={userUpdates[user.email] === 'active'}
                onChange={() => handleStatusChange(user.email, 'active')}
              />
              Active
            </label>
            <label>
              <input
                type="radio"
                name={user.email}
                value="inactive"
                checked={userUpdates[user.email] === 'inactive'}
                onChange={() => handleStatusChange(user.email, 'inactive')}
              />
              Inactive
            </label>
          </div>
        ))}
        {StatusMessage && <div className="success-message">{StatusMessage}</div>}
        <button type="submit" className="submit-button">
          Change Status
        </button>
      </form>
      <div className="form-group">
          <label htmlFor="ticketType">Ticket Type:</label>
          <select id="ticketType" name="ticketType" onChange={handleTicketTypeChange} value={selectedTicketType}>
            {ticketTypes.map((type) => (
              <option key={type.ticket_type} value={type.ticket_type}>
                {type.ticket_type}
              </option>
            ))}
          </select>
        </div>
    </div>
  );
        }
export default ManageUsers;

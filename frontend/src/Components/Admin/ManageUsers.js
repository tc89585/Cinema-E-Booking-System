import React, { useState, useEffect } from 'react';
import { useAuth } from '../Context'

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [userUpdates, setUserUpdates] = useState({});
  const [StatusMessage, setStatusMessage] = useState('');
  const { token } = useAuth();
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/admins";

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
    <div>
      <h2>Manage Users</h2>
      <form onSubmit={handleSubmit}>
        {users.map(user => (
          <div key={user.email}>
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
        {StatusMessage && <div className="statusUpdate-message">{StatusMessage}</div>}
        <button type="submit">Change Status</button>
      </form>
    </div>
  );
}

export default ManageUsers;

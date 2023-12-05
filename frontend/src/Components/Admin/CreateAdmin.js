import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from "../Context";

const CreateAdminUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/admins";
  const { token } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/getAllUsers`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users', error);
      }
      setLoading(false);
    };

    fetchUsers();
  }, []);

  const handleMakeAdmin = async (email) => {
    try {
      const response = await axios.patch(`${API_URL}/createAdmin`, { email}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log(response.data);
      // Update the user list or give feedback to the user
    } catch (error) {
      console.error('Error creating admin', error);
    }
  };

  return (
    <div>
      <h1>Users</h1>
      {loading ? <p>Loading...</p> : (
        <ul>
          {users.map(user => (
            <li key={user.user_id}>
              {user.email} - {user.role}
              {user.role !== 'admin' && (
                <button onClick={() => handleMakeAdmin(user.email)}>Make Admin</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CreateAdminUser;

// Profile.js

import React, { useState, useEffect } from 'react';
import './Profile.css';
import axios from 'axios';
import { useAuth } from './Context';
import { jwtDecode } from 'jwt-decode';

function Profile() {
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [billing_address, setStreetAddress] = useState('');
  const [card_number, setCardNumber] = useState(''); // New field
  const [isChangePassword, setIsChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [subscribeToPromotions, setSubscribeToPromotions] = useState(false);
  const [user, setUser] = useState({
    firstname: '',
    lastname: '',
    billing_address: '',
    card_number: '', // New field
    subscribeToPromotions: false,
  });

  const { token } = useAuth();

  const fetchUserData = async () => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/users';
      const userId = jwtDecode(token).user_id;
      const response = await axios.get(`${API_URL}/getUserById/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const userData = response.data;
        setFirstName(userData.firstname);
        setLastName(userData.lastname);
        setStreetAddress(userData.billing_address);
        setCardNumber(userData.card_number); // Set new field
        setSubscribeToPromotions(userData.is_subscribed);
      } else {
        console.error('Failed to fetch user data:', response);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []); 

  const handleUpdateProfile = async () => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/users';
      const response = await axios.put(
        `${API_URL}/edit-profile`,
        {
          firstname,
          lastname,
          billing_address,
          card_number, // Include new field
          is_subscribed: subscribeToPromotions,
          currentPassword,
          newPassword
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        console.log('Profile updated successfully:');
      } else {
        const data = await response.json();
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      alert('Network error. Please try again.');
    }
  };

  const handleUpdatePassword = () => {
    // Handle updating user password with the provided data
    // You can send a request to your backend to change the password
    // Example: Send a PUT request to /api/changePassword with the new password
  };

  return (
    
    <div className="edit-profile-container">
      <div className="edit-profile-form">
        <h2>Edit Profile</h2>
        <form>
          <div className="form-group">
            <input
              type="text"
              placeholder="First Name"
              value={firstname}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Last Name"
              value={lastname}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Street Address"
              value={billing_address}
              onChange={(e) => setStreetAddress(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Card Number"
              value={card_number}
              onChange={(e) => setCardNumber(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={subscribeToPromotions}
                onChange={() => setSubscribeToPromotions(!subscribeToPromotions)}
              />
              Subscribe to Promotions
            </label>
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={isChangePassword}
                onChange={() => setIsChangePassword(!isChangePassword)}
              />
              Change Password
            </label>
          </div>
          {isChangePassword && (
            <div className="password-change-section">
              <input
                type="password"
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button onClick={handleUpdatePassword} className="password-change-button">
                Change Password
              </button>
            </div>
          )}
          <button onClick={handleUpdateProfile} className="update-button">
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;

import React, { useState, useEffect, useParams} from 'react';
import './Profile.css';
import axios from 'axios';
import { useAuth } from './Context';
import { jwtDecode } from 'jwt-decode';

function Profile() {
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [billing_address, setStreetAddress] = useState('');
  const [isChangePassword, setIsChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [subscribeToPromotions, setSubscribeToPromotions] = useState(false);
  const [user, setUser] = useState({ firstname: '', lastname: '', billing_address: '', subscribeToPromotions: false });


  const { token } = useAuth(); // Assuming useAuth provides access to the authentication context

  const fetchUserData = async () => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/users";
      const userId = jwtDecode(token).user_id; 
      const response = await axios.get(`${API_URL}/getUserById/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });


      if (response.status === 200) {
        const userData = response.data;
        // Update state with fetched data
        setFirstName(userData.firstname);
        setLastName(userData.lastname);
        setStreetAddress(userData.billing_address);
        setSubscribeToPromotions(userData.is_subscribed)
        // ... set other user data as needed ...
      } else {
        // Handle non-200 responses
        console.error('Failed to fetch user data:', response);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // useEffect hook to fetch data on mount
  useEffect(() => {
    fetchUserData();
  }, []); // Empty depe

  const handleUpdateProfile = async () => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/users";
      const response = await axios.put(
        `${API_URL}/edit-profile`,
        {
          firstname,
          lastname,
          billing_address,
          is_subscribed: subscribeToPromotions,
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
    console.log(handleUpdateProfile);
  };
  const handleUpdatePassword = () => {
    // Handle updating user password with the provided data
    // You can send a request to your backend to change the password
    // Example: Send a PUT request to /api/changePassword with the new password
  };
const handlePaymentUpdate = () => {

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

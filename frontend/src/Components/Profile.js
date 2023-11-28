import React, { useState } from 'react';
import './Profile.css';
import { useUser } from './UserContext'; 

function Profile() {
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [isChangePassword, setIsChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [subscribeToPromotions, setSubscribeToPromotions] = useState(false); // New state for promotions

  const handleUpdateProfile = async () => {
    try {
      const response = await fetch('/users/edit-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstname,
          lastname,
          billing_address: streetAddress,
          // You can include other fields here as needed, and exclude those not used
          is_subscribed: subscribeToPromotions,
        }),
      });

      if (response.ok) {
        // Profile updated successfully
        // Provide feedback to the user
        console.log('Profile updated successfully:', userData); // You can replace this with a custom notification component
      } else {
        const data = await response.json();
        // Handle errors and show error messages
        alert(`Error: ${data.error}`); // You can replace this with a custom error message component
      }
    } catch (error) {
      // Handle network errors
      alert('Network error. Please try again.'); // You can replace this with a custom network error message component
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
              value={streetAddress}
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

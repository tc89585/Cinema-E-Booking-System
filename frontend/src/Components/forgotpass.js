import React, { useState } from 'react';
import axios from 'axios'; // Import axios for making HTTP requests
import "./forgotpass.css";

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [step, setStep] = useState(1); // 1: Email Input, 2: Code Verification, 3: New Password
  const API_URL = 'http://localhost:8080/users';
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      // Call the /sendCode endpoint with the entered email
      const response = await axios.post(`${API_URL}/sendCode`, { email });
      setMessage(response.data.message);
      setStep(2); // Move to code verification step
    } catch (error) {
      setMessage(error.response.data.message);
    }
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/users/checkCode', { email, code });
      setMessage(response.data.message);
      setStep(3); // Move to new password step
    } catch (error) {
      setMessage(error.response ? error.response.data.message : 'An error occurred');
    }
};

  const handleNewPasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/forgotPassword`, { email, password: newPassword });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response.data.message);
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Forgot Password</h2>
      {step === 1 && (
        <form onSubmit={handleEmailSubmit}>
          <div className="form-group">
            <input type="email" placeholder="Email" value={email} onChange={handleEmailChange} required />
          </div>
          <button type="submit" className="reset-password-button">Send Verification Code</button>
        </form>
      )}
      {step === 2 && (
        <form onSubmit={handleCodeSubmit}>
          <div className="form-group">
            <input type="text" placeholder="Verification Code" value={code} onChange={handleCodeChange} required />
          </div>
          <button type="submit" className="reset-password-button">Verify Code</button>
        </form>
      )}
      {step === 3 && (
        <form onSubmit={handleNewPasswordSubmit}>
          <div className="form-group">
            <input type="password" placeholder="New Password" value={newPassword} onChange={handleNewPasswordChange} required />
          </div>
          <button type="submit" className="reset-password-button">Update Password</button>
        </form>
      )}
      {message && <div className="message">{message}</div>}
    </div>
  );
}

export default ForgotPassword;
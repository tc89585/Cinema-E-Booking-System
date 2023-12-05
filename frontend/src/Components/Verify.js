import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import "./verify.css"; // Make sure to have your CSS file in place

const API_URL = 'http://localhost:8080/users';

function Verify() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [step, setStep] = useState(1); // 1: Email Input, 2: Code Verification
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/sendCode`, { email });
      setMessage(response.data.message);
      setStep(2); // Move to code verification step
    } catch (error) {
      setMessage(error.response ? error.response.data.message : 'Error sending verification code');
    }
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/checkCode`, { email, code });
      setMessage(response.data.message);
      if (response.status === 200) {
        navigate('/login'); // Redirect to the sign-up page on successful verification
      }
    } catch (error) {
      setMessage(error.response ? error.response.data.message : 'Error verifying code');
    }
  };

  return (
    <div className="verify-container">
      <h2>Verify Your Email</h2>
      {message && <div className="message">{message}</div>}
      {step === 1 && (
        <form onSubmit={handleEmailSubmit}>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="verify-button">
            Send Verification Code
          </button>
        </form>
      )}
      {step === 2 && (
        <form onSubmit={handleCodeSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Verification Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="verify-button">
            Verify Code
          </button>
        </form>
      )}

      <Link to="/login" className="toggle-link">Back to Login</Link>
    </div>
  );
}

export default Verify;
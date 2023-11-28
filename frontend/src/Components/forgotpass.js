import React, { useState } from 'react';
import "./forgotpass.css";
function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can add logic to handle the forgotten password process here.
    // For now, let's just display a message.
    setMessage(`A password reset email will be sent to ${email}`);
  };

  return (
    <div className="forgot-password-container">
      <h2></h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
            required
          />
        </div>
        <button type="submit" className="reset-password-button">
          Reset Password
        </button>
      </form>
      {message && <div className="message">{message}</div>}
    </div>
  );
}

export default ForgotPassword;

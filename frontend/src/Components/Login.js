import React, { useState } from 'react';
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [subscribeToPromotions, setSubscribeToPromotions] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handlePasswordConfirmChange = (e) => {
    setPasswordConfirm(e.target.value);
  };

  const handlePromotionsChange = (e) => {
    setSubscribeToPromotions(e.target.checked);
  };

  const handleFormToggle = () => {
    setIsLogin(!isLogin);
    setErrorMessage('');
    setIsRegistered(false);
    // Clear form fields here if needed
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      // Add your login logic here
      setErrorMessage('');
    } else {
      // Form validation
      if (!username || !email || !password || !passwordConfirm) {
        setErrorMessage('Please fill in all mandatory fields.');
      } else if (password !== passwordConfirm) {
        setErrorMessage('Password and confirm password must match.');
      } else {
        // Registration successful
        setIsRegistered(true);
        setErrorMessage('');
        // Clear form fields or navigate to a confirmation page
      }
    }
  };

  return (
    <div className="login-container">
      <div className={`login-form ${isLogin ? 'login-form-login' : 'login-form-signup'}`}>
        <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={handleUsernameChange}
                required
              />
            </div>
          )}
          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={handleEmailChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
          </div>
          {!isLogin && (
            <div className="form-group">
              <input
                type="password"
                placeholder="Confirm Password"
                value={passwordConfirm}
                onChange={handlePasswordConfirmChange}
                required
              />
            </div>
          )}
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={subscribeToPromotions}
                onChange={handlePromotionsChange}
              />
              Subscribe to Promotions
            </label>
          </div>
          <button type="submit" className="login-button">
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        {isRegistered && (
          <div className="confirmation-message">Registration successful! You can now log in.</div>
        )}
        <p>
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <span className="toggle-link" onClick={handleFormToggle}>
            {isLogin ? 'Sign Up' : 'Login'}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
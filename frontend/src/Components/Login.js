import React, { useState } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './Context.js'; // Ensure this path is correct

const API_URL = 'http://localhost:8080';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [role, setRole] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const navigate = useNavigate();

  const { setToken } = useAuth(); // Use the setToken function from AuthContext

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
    setIsSubscribed(e.target.checked);
  };

  const handleFormToggle = () => {
    setIsLogin(!isLogin);
    setErrorMessage('');
    setIsRegistered(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      try {
        const response = await fetch(`${API_URL}/users/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        if (response.status === 200) {
          const userData = await response.json();
          console.log('Login successful!');
          localStorage.setItem('token', userData.token);
          setToken(userData.token); // Update the token in AuthContext
          navigate('/'); // Redirect to the homepage or dashboard
        } else {
          setErrorMessage(
            'Authentication failed. Please check your email and password.'
          );
        }
      } catch (error) {
        console.error('Error:', error);
        setErrorMessage('An error occurred. Please try again later.');
      }
    } else {
      if (!email || !password || !passwordConfirm) {
        setErrorMessage('Please fill in all mandatory fields.');
      } else if (password !== passwordConfirm) {
        setErrorMessage('Password and confirm password must match.');
      } else {
        const registrationData = {
          role,
          email,
          password,
          is_subscribed: isSubscribed,
          firstname,
          lastname,
        };
        try {
          const response = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(registrationData),
          });

          if (response.ok) {
            setIsRegistered(true);
            setErrorMessage('');
          } else {
            const errorData = await response.json();
            setErrorMessage(errorData.message);
          }
        } catch (error) {
          console.error('Error:', error);
          setErrorMessage('An error occurred. Please try again later.');
        }
      }
    }
  };

  return (
    <div className="login-container">
      <div
        className={`login-form ${
          isLogin ? 'login-form-login' : 'login-form-signup'
        }`}
      >
        <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <input
                type="text"
                placeholder="Role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              />
            </div>
          )}
          {!isLogin && (
            <div className="form-group">
              <input
                type="text"
                placeholder="First Name"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                required
              />
            </div>
          )}
          {!isLogin && (
            <div className="form-group">
              <input
                type="text"
                placeholder="Last Name"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
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
          {!isLogin && (
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="checkbox"
                  checked={isSubscribed}
                  onChange={handlePromotionsChange}
                  style={{ marginRight: '5px' }}
                />
                Subscribe to Promotions
              </label>
            </div>
          )}
          {isLogin && (
            <Link to="/forgotpassword" style={{ margin: '10px 0' }}>
              Forgot Password?
            </Link>
          )}
          <button type="submit" className="login-button">
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        {isRegistered && (
          <div className="confirmation-message">
            Registration successful! You can now log in.
          </div>
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

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
  const [card_number, setCreditCard] = useState('');
  const [card_type, setCardType] = useState('');
  const [expiration_date, setCardExpiration] = useState('');
  const [billing_address, setBillingAddress] = useState('');
  const [isSignupClicked, setIsSignupClicked] = useState(false);



  const { setToken } = useAuth(); // Use the setToken function from AuthContext

  const handleCreditCardChange = (e) => {
    setCreditCard(e.target.value);
  };

  const handleCardTypeChange = (e) => {
    setCardType(e.target.value);
  };

  const handleCardExpirationChange = (e) => {
    setCardExpiration(e.target.value);
  };

  const handleBillingAddressChange = (e) => {
    setBillingAddress(e.target.value);
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
          setToken(userData.token);

         
        // Check if the logged-in user is an admin
        if (userData.role === 'admin') {
          // Redirect to the admin page
          navigate('/admin');
        } else {
          // Redirect to the homepage or dashboard for regular users
          navigate('/');
        }
          
    
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
          card_type,
          card_number,
          expiration_date,
          billing_address,

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

          // Navigate to the verification page
          navigate('/verify');
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
              <input
                type="text"
                className="credit-card-input"
                placeholder="Credit Card"
                value={card_number}
                onChange={handleCreditCardChange}
                required
              />
            </div>
          )}
          {!isLogin && (
            <div className="form-group">
              <select
                className="card-type-input"
                value={card_type}
                onChange={handleCardTypeChange}
              >
                <option value="" disabled>
                  Select Card Type
                </option>
                <option value="visa">Visa</option>
                <option value="mastercard">MasterCard</option>
                <option value="amex">AMX</option>
              </select>
            </div>
          )}
          {!isLogin && (
            <div className="form-group">
              <input
                type="text"
                className="billing-address-input"
                placeholder="Billing Address"
                value={billing_address}
                onChange={handleBillingAddressChange}
                required
              />
            </div>
          )}
          {!isLogin && (
            <div className="form-group">
              <input
                type="text"
                className="card-expiration-input"
                placeholder="Card Expiration Date"
                value={expiration_date}
                onChange={handleCardExpirationChange}
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
          <Link to="/verify">
            <span className="toggle-link" onClick={handleFormToggle}>
              {isLogin ? 'Sign Up' : 'Login'}
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;

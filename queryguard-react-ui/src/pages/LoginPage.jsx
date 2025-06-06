import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://3.149.254.38:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        console.log('Login successful! Session established.');
        navigate('/portal');
      } else {
        console.warn('Login failed.');
        setError('Invalid username or password.');
      }
    } catch (err) {
      console.error('Error logging in:', err.message);
      setError('Server error. Please try again.');
    }
  };

  return (
    <div className="login-page-body">
      <div className="login-container">
        <h2 className="login-header">Log in to Query Guard</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="login-input"
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <a href="#" className="forgot-password">Forgot password?</a>
          <button type="submit" className="proceed-btn">Proceed</button>
        </form>
      </div>
    </div>
  );
}

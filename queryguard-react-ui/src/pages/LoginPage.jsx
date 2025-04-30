import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css';

export default function LoginPage() {
  const navigate = useNavigate();

  // New: State for user input
  const [email, setEmail] = useState('');
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
        body: JSON.stringify({ username: email, password: password })
      });

      if (response.ok) {
        console.log(' Login successful!');
        navigate('/portal');
      } else {
        console.log(' Login failed.');
        setError('Invalid username or password.');
      }
    } catch (err) {
      console.error(' Error logging in:', err.message);
      setError('Server error. Please try again.');
    }
  };

  return (
    <div className="login-page-body">
      <div className="login-container">
        <div className="login-header">Log in to Query Guard</div>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="email">Email address</label>
            <input
              type="text"
              id="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            />
          </div>

          {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}

          <a href="#" className="forgot-password">Forgot password?</a>
          <button type="submit" className="proceed-btn">Proceed</button>
        </form>
      </div>
    </div>
  );
}

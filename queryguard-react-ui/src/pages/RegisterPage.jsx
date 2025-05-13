import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [serverIP, setServerIP] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://3.149.254.38:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username,
          password: password,
          registered_ip: serverIP
        })
      });

      if (response.ok) {
        setSuccess('Account created! You can now log in.');
        setError('');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        const data = await response.json();
        setError(data.message || 'Registration failed.');
        setSuccess('');
      }
    } catch (err) {
      console.error('Error during registration:', err);
      setError('Server error. Please try again.');
      setSuccess('');
    }
  };

  return (
    <div className="login-page-body">
      <div className="login-container">
        <div className="login-header">Create a QueryGuard Account</div>
        <form onSubmit={handleRegister}>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              className="login-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="server-ip">Server IP to Monitor</label>
            <input
              id="server-ip"
              type="text"
              className="login-input"
              value={serverIP}
              onChange={(e) => setServerIP(e.target.value)}
              required
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          <button type="submit" className="proceed-btn">Register</button>
        </form>
      </div>
    </div>
  );
}

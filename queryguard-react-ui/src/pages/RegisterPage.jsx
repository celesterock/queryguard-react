import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
        setTimeout(() => navigate('/login'), 2000); // redirect after 2s
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
            <label>Username</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="input-group">
            <label>Server IP to Monitor</label>
            <input value={serverIP} onChange={(e) => setServerIP(e.target.value)} required />
          </div>
          {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
          {success && <div style={{ color: 'green', marginTop: '10px' }}>{success}</div>}
          <button type="submit" className="proceed-btn">Register</button>
        </form>
      </div>
    </div>
  );
}

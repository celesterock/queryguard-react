import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css';




export default function LoginPage() {
    const navigate = useNavigate();
  return (
    <div className="login-page-body">
      <div className="login-container">
        <div className="login-header">Log in to Query Guard</div>
        <form>
          <div className="input-group">
            <label htmlFor="email">Email address</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" required />
          </div>
          <a href="#" className="forgot-password">Forgot password?</a>
          <button type="submit" className="proceed-btn" onClick={() => navigate('/portal')}>Proceed</button>
        </form>
      </div>
    </div>
  );
}

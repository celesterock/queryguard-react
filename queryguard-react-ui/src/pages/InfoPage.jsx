import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import "../styles/InfoPage.css";

export default function InfoPage() {
  return (
    <div>
      <hr
        style={{
          border: "none",
          borderTop: "1px solid #ccc",
          margin: "1rem 0",
        }}
      />
      <header>
        <h1>QueryGuard</h1>
        <nav>
          <a href="#features">Features </a>
          <a href="#how-it-works">How It Works </a>
          <a href="#pricing">Pricing</a>
          <Link to="/login" className="button">
            Log In
          </Link>
          <Link to="/register" className="button">
            Create Account
          </Link>
        </nav>
      </header>
      <hr
        style={{
          border: "none",
          borderTop: "1px solid #ccc",
          margin: "1rem 0",
        }}
      />
      <div className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h2>Protect Web Applications with Intelligent Detection</h2>
            <p>
              QueryGuard uses advanced AI models to understand and detect
              malicious patterns in real-time—safeguarding your websites against
              SQL injection, unauthorized access, and data breaches.
            </p>
          </div>
          <div className="hero-image">
            <img src={logo} alt="QueryGuard Logo" />
          </div>
        </div>
      </div>

      <div id="features" className="features-section">
        <h3>Powerful Features</h3>
        <div className="features-grid">
          <div className="feature-card">
            <h4>ML-Powered Detection</h4>
            <p>Advanced AI models detect SQL injection threats in real-time.</p>
          </div>
          <div className="feature-card">
            <h4>Real-Time Analytics</h4>
            <p>Monitor visitor logs and suspicious activities instantly.</p>
          </div>
          <div className="feature-card">
            <h4>Easy API Integration</h4>
            <p>Supports custom log formats.</p>
          </div>
          <div className="feature-card">
            <h4>Lightning Fast</h4>
            <p>Optimized for speed without affecting site performance.</p>
          </div>
          <div className="feature-card">
            <h4>Instant Alerts</h4>
            <p>Get notified of potential SQLi attacks immediately.</p>
          </div>
          <div className="feature-card">
            <h4>Customizable Rules</h4>
            <p>Fine-tune settings to fit your security needs.</p>
          </div>
        </div>
      </div>
      <footer>
        <p>&copy; 2025 QueryGuard. All rights reserved.</p>
      </footer>
    </div>
  );
}

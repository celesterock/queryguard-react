import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/InfoPage.css';

export default function InfoPage() {
  return (
    <div>
      <header>
        <h1>QueryGuard</h1>
        <nav>
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#pricing">Pricing</a>
          <Link to="/login" className="button">Get Started</Link>
        </nav>
      </header>

      <section className="hero">
        <h2>Secure Your Web Applications with AI</h2>
        <p>Real-time website analytics meets AI-powered SQL injection detection.</p>
        <Link to="/login" className="button">Log In</Link>
	<Link to="/register" className="button">Create Account</Link>
      </section>

      <section id="features" className="features">
        <h3>Powerful Features</h3>

        <div className="feature">
          <h4>ML-Powered Detection</h4>
          <p>Advanced AI models detect SQL injection threats in real-time.</p>
        </div>
        <div className="feature">
          <h4>Real-Time Analytics</h4>
          <p>Monitor visitor logs and suspicious activities instantly.</p>
        </div>
        <div className="feature">
          <h4>Easy API Integration</h4>
          <p>Supports custom log formats.</p>
        </div>
        <div className="feature">
          <h4>Lightning Fast</h4>
          <p>Optimized for speed without affecting site performance.</p>
        </div>
        <div className="feature">
          <h4>Instant Alerts</h4>
          <p>Get notified of potential SQLi attacks immediately.</p>
        </div>
        <div className="feature">
          <h4>Customizable Rules</h4>
          <p>Fine-tune settings to fit your security needs.</p>
        </div>
      </section>

      <footer>
        <p>&copy; 2025 QueryGuard. All rights reserved.</p>
      </footer>
    </div>
  );
}

import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../styles/UserPortal.css";

export default function UserPortal() {
  const navigate = useNavigate();
  return (
    <div className="user-portal-body">
      <header>
        <h1>QueryGuard</h1>
        <nav>
          <a href="#dashboard">Dashboard</a>
          <a href="#tutorials">Tutorials</a>
        </nav>
      </header>

      <section className="hero">
        <h2>Welcome Back to QueryGuard</h2>
        <p>Manage your website analytics efficiently.</p>
      </section>

      <section id="dashboard" className="card">
        <h3>Go to Your Dashboard</h3>
        <p>Access your security logs, analytics, and real-time insights.</p>
        <Link
          to="/dashboard"
          className="button"
          onClick={() => navigate("/dashboard")}
        >
          Go to Dashboard
        </Link>
      </section>

      <section id="tutorials" className="card">
        <h3>Setup & Tutorials</h3>
        <p>
          Learn how to integrate QueryGuard, analyze logs, and configure
          settings.
        </p>
        <Link to="/tutorials" className="button">
          View Tutorials
        </Link>
      </section>

      <footer>
        <p>&copy; 2025 QueryGuard. All rights reserved.</p>
      </footer>
    </div>
  );
}

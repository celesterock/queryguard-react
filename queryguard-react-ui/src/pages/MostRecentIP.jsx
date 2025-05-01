import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/QueryGuardDashboard.css';

export default function IPDetails() {
  const items = ['192.168.0.1', '203.0.113.42', '10.0.0.2'];

  return (
    <div className="card">
      <h1 className="card-title">Most Recent IP Addresses</h1>
      <ul className="card-list">
        {items.map((ip, idx) => (
          <li key={idx}>{ip}</li>
        ))}
      </ul>
      <Link to="/" className="card-link">Back to Dashboard</Link>
    </div>
  );
}


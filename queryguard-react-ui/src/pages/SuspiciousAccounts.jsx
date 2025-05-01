import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/QueryGuardDashboard.css';

export default function SuspiciousAccounts() {
  const items = ['admin_test', 'sql_h4ck3r', 'guest123'];

  return (
    <div className="card">
      <h1 className="card-title">Suspicious Account Names</h1>
      <ul className="card-list">
        {items.map((acct, idx) => (
          <li key={idx}>{acct}</li>
        ))}
      </ul>
      <Link to="/" className="card-link">Back to Dashboard</Link>
    </div>
  );
}

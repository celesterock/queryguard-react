import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/QueryGuardDashboard.css';

export default function CompromisedAccounts() {
  const items = ['user_x', 'dev_root', 'janedoe'];

  return (
    <div className="card">
      <h1 className="card-title">Compromised Account Names</h1>
      <ul className="card-list">
        {items.map((acct, idx) => (
          <li key={idx}>{acct}</li>
        ))}
      </ul>
      <Link to="/" className="card-link">Back to Dashboard</Link>
    </div>
  );
}


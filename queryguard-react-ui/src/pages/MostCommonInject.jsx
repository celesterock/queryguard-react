import React from 'react';
import { Link } from 'react-router-dom';

import '../styles/QueryGuardDashboard.css';

export default function CommonInjections() {
  const items = [
    "' OR '1'='1 (85%)",
    'UNION SELECT (10%)',
    'DROP TABLE (5%)',
  ];

  return (
    <div className="card">
      <h1 className="card-title">Most Common SQL Injections</h1>
      <ul className="card-list">
        {items.map((inj, idx) => (
          <li key={idx}>{inj}</li>
        ))}
      </ul>
      <Link to="/" className="card-link">Back to Dashboard</Link>
    </div>
  );
}

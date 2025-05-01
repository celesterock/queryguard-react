import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/QueryGuardDashboard.css';    // make sure this file is alongside this one

export default function MostRecentInjections() {
  const injections = [
    "' OR '1'='1",
    'DROP TABLE users;',
    '-- Comment',
  ];

  return (
    <div className="card">
      <h1 className="card-title">
        Most Recent SQL Injections
      </h1>
      <ul className="card-list">
        {injections.map((inj, idx) => (
          <li key={idx}>{inj}</li>
        ))}
      </ul>
      <Link to="/" className="card-link">
        Back to Dashboard
      </Link>
    </div>
  );
}

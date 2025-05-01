import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/QueryGuardDashboard.css';

export default function CompromisedDataSources() {
  const items = ['Database A', 'Customer Table', 'Employee Records'];

  return (
    <div className="card">
      <h1 className="card-title">Compromised Data Sources</h1>
      <ul className="card-list">
        {items.map((src, idx) => (
          <li key={idx}>{src}</li>
        ))}
      </ul>
      <Link to="/" className="card-link">Back to Dashboard</Link>
    </div>
  );
}

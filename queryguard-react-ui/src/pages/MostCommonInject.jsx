import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/QueryGuardDashboard.css';

export default function CommonInjections() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://3.149.254.38:3000/api/common-injections')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        const formatted = data.map((row) => {
          const body =
            typeof row.injection === 'string'
              ? row.injection
              : JSON.stringify(row.injection);
          return `${body} (${row.count})`;
        });
        setItems(formatted);
      })
      .catch((err) => {
        console.error('Error fetching common injections:', err);
        setError('Failed to load data');
      });
  }, []);

  return (
    <div className="card">
      <h1 className="card-title">Most Common SQL Injections</h1>
      {error && <p className="text-red-500">{error}</p>}
      <ul className="card-list">
        {items.map((inj, idx) => (
          <li key={idx}>{inj}</li>
        ))}
      </ul>
      <Link to="/dashboard" className="card-link">Back to Dashboard</Link>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/QueryGuardDashboard.css';

export default function MostRecentInject() {
  const [injections, setInjections] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://3.142.55.88:3000/api/recent-injections')
      .then((res) => {
        if (!res.ok) throw new Error(`Status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const formatted = data.map((item) => {
          const body = item.injection?.query || JSON.stringify(item.injection);
          return body;
        });
        setInjections(formatted);
      })
      .catch((err) => {
        console.error('Error fetching recent injections:', err);
        setError('Failed to load data');
      });
  }, []);

  return (
    <div className="card">
      <h1 className="card-title">Most Recent SQL Injections</h1>
      {error && <p className="text-red-500">{error}</p>}
      <ul className="card-list">
        {injections.map((inj, idx) => (
          <li key={idx}>{inj}</li>
        ))}
      </ul>
      <Link to="/dashboard" className="card-link">Back to Dashboard</Link>
    </div>
  );
}

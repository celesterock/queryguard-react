import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/QueryGuardDashboard.css';

export default function MostRecentIP() {
  const [ips, setIps] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://3.142.55.88:3000/api/most-recent-ips')
      .then((res) => {
        if (!res.ok) throw new Error(`Status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log("Fetched IPs:", data);
        const filtered = [...new Set(
          data.filter(ip => ip && !ip.startsWith('::'))
        )];
        setIps(filtered);
      })
      .catch((err) => {
        console.error('Error fetching recent IPs:', err);
        setError('Failed to load data');
      });
  }, []);

  return (
    <div className="card">
      <h1 className="card-title">Most Recent IP Addresses</h1>
      {error && <p className="text-red-500">{error}</p>}
      <ul className="card-list">
        {ips.map((ip, idx) => (
          <li key={idx}>{ip}</li>
        ))}
      </ul>
      <Link to="/dashboard" className="card-link">Back to Dashboard</Link>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/QueryGuardDashboard.css';

export default function MostRecentIP() {
  const [ips, setIps] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://3.149.254.38:3000/api/most-recent-ips', { credentials: 'include' })
      .then((res) => {
        if (!res.ok) throw new Error(`Status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const filtered = data
          .filter(ip => typeof ip === 'string' && ip.length > 5 && !ip.startsWith('::'))
          .slice(0, 50);
        setIps(filtered);
      })
      .catch((err) => {
        console.error('Error fetching recent IPs:', err);
        setError('Failed to load IP data.');
      });
  }, []);

  return (
    <div className="card viewmore-page">
      <h1 className="card-title">
        Most Recent IP Addresses
      </h1>

      {error && <p className="text-red-500">{error}</p>}

      {ips.length > 0 ? (
        <ul className="card-list">
          {ips.map((ip, idx) => (
            <li key={idx}>
	      <Link to={`/ip/${encodeURIComponent(ip)}`}>
                  <span role="img" aria-label="ip"></span> {ip}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading recent IPs...</p>
      )}

      <Link to="/dashboard" className="card-link">
        ← Back to Dashboard
      </Link>
    </div>
  );
}

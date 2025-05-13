import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../styles/QueryGuardDashboard.css';

export default function IpLogsPage() {
  const { ipAddress } = useParams();
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/logs-by-ip?ip=${encodeURIComponent(ipAddress)}`, { credentials: 'include' })
      .then(res => {
        if (!res.ok) throw new Error(`Status: ${res.status}`);
        return res.json();
      })
      .then(data => setLogs(data))
      .catch(err => {
        console.error('Error fetching logs:', err);
        setError('Failed to load log data.');
      });
  }, [ipAddress]);

  return (
    <div className="card viewmore-page">
      <h1 className="card-title">Logs from {ipAddress}</h1>

      {error && <p className="text-red-500">{error}</p>}

      {logs.length > 0 ? (
        <ul className="card-list">
          {logs.map((log, idx) => (
            <li key={idx}>
              <strong>{log.method}</strong> <code>{log.endpoint}</code><br />
              <span style={{ fontSize: '0.9rem', color: '#666' }}>{new Date(log.timestamp).toLocaleString()}</span><br />
              <span style={{ fontFamily: 'monospace' }}>
                {typeof log.request_body === 'string'
                  ? log.request_body
                  : JSON.stringify(log.request_body)}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No SQL injection logs found from this IP.</p>
      )}

      <Link to="/ip-details" className="card-link">← Back to IP list</Link>
    </div>
  );
}

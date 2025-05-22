import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import logo from '../assets/logo_white.png';
import continentsMap from '../assets/world_map.jpg';
import '../styles/QueryGuardDashboard.css';
import EndpointPieChart from './EndpointPieChart';
import AttacksPerDayChart from './AttacksPerDayChart';
import TopAttackerBarChart from './TopAttackerBarChart';
import AttacksByHourChart from './AttacksByHourChart';

export default function QueryGuardDashboard() {
  const [data, setData] = useState({ common: [], recent: [], ips: [], endpoints: [], sqliIps: [] });
  const [attacksPerDayData, setAttacksPerDayData] = useState([]);
  const [attacksByHourData, setAttacksByHourData] = useState([]);
  const [continentStats, setContinentStats] = useState({});
  const [hoveredContinent, setHoveredContinent] = useState(null);
  const [tooltip, setTooltip] = useState({ visible: false, text: '', x: 0, y: 0 });
  const [activeContinent, setActiveContinent] = useState(null);
  const [continentIps, setContinentIps] = useState([]);
  const [userId, setUserId] = useState(null);
  const [showBanner, setShowBanner] = useState(false);

  const triggerBanner = () => {
    setShowBanner(true);
    refreshDashboardData();
  };

  const handleContinentClick = (continentKey) => {
    if (continentKey === activeContinent) {
      setActiveContinent(null);
      setContinentIps([]);
      return;
    }
    setActiveContinent(continentKey);
    fetch(`/api/logs-by-continent?continent=${continentKey}`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => setContinentIps(data))
      .catch(() => setContinentIps([]));
  };

  const refreshDashboardData = () => {
    Promise.all([
      fetch('/api/common-injections', { credentials: 'include' }).then(res => res.json()),
      fetch('/api/recent-injections', { credentials: 'include' }).then(res => res.json()),
      fetch('/api/most-recent-ips', { credentials: 'include' }).then(res => res.json()),
      fetch('/api/top-attacked-endpoints', { credentials: 'include' }).then(res => res.json()),
      fetch('/api/top-sqli-ips', { credentials: 'include' }).then(res => res.json())
    ]).then(([common, recent, ips, endpoints, sqliIps]) => {
      setData({
        common: common.slice(0, 5).map(row => `${row.injection} (${row.count})`),
        recent: recent.slice(0, 5).map(row => row.injection),
        ips: ips.slice(0, 5),
        endpoints: endpoints.slice(0, 5).map(row => ({ label: `${row.endpoint} (${row.count})`, raw: row.endpoint })),
        sqliIps: sqliIps || []
      });
    });

    fetch('/api/chart/injections-per-day', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        const grouped = {};
        data.forEach(row => {
          if (Number(row.prediction) === 1) {
            const day = new Date(row.timestamp).toISOString().split('T')[0];
            grouped[day] = (grouped[day] || 0) + 1;
          }
        });
        setAttacksPerDayData(Object.entries(grouped).map(([date, count]) => ({ date, count })));
      });

    fetch('/api/injections-by-hour', { credentials: 'include' })
      .then(res => res.json())
      .then(setAttacksByHourData);

    fetch('/api/continent-stats', { credentials: 'include' })
      .then(res => res.json())
      .then(setContinentStats);
  };

  useEffect(() => {
    fetch('/me', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setUserId(data.userId));
  }, []);

  useEffect(() => {
    if (!userId) return;
    const socket = io('http://3.149.254.38:3000');
    socket.on(`sqli:${userId}`, () => triggerBanner());
    return () => socket.disconnect();
  }, [userId]);

  useEffect(() => {
    const timeout = setTimeout(() => setShowBanner(false), 5000);
    return () => clearTimeout(timeout);
  }, [showBanner]);

  useEffect(() => { refreshDashboardData(); }, []);

  const showTooltip = (e, text) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({ visible: true, text, x: e.clientX - rect.left + 10, y: e.clientY - rect.top + 10 });
  };
  const hideTooltip = () => setTooltip(t => ({ ...t, visible: false }));

  const dynamicCards = [
    {
      title: 'Most Recent IP Addresses',
      items: data.ips,
      link: '/ip-details',
    },
    {
      title: 'Most Recent SQL Injections',
      items: data.recent,
      link: '/recent-injections',
    },
    {
      title: 'Most Common SQL Injections',
      items: data.common,
      link: '/common-injections',
    },
    {
      title: 'Top Attacked Endpoints',
      items: data.endpoints.map((item) => (
        <Link to={`/endpoint/${encodeURIComponent(item.raw)}`} key={item.raw}>
          {item.label}
        </Link>
      )),
      link: '/endpoint-details'
    },
  ];

  return (
    <div>
      {showBanner && (
        <div className="alert-banner">
          <span>SQL Injection Detected</span>
          <button onClick={() => setShowBanner(false)} className="banner-close">×</button>
        </div>
      )}

      <div className="dashboard-header">
        <img src={logo} alt="QueryGuard Logo" className="dashboard-logo" />
      </div>

      <div className="dashboard-logout">
        <button className="logout-button" onClick={() => {
          fetch('/logout', { method: 'POST', credentials: 'include' })
            .then(() => { window.location.href = '/'; })
            .catch(err => console.error('Logout failed:', err));
        }}>
          Log Out
        </button>
      </div>

      <div className="cards-container">
        {dynamicCards.map(card => (
          <div key={card.title} className="card">
            <h2 className="card-title">{card.title}</h2>
            <ul className="card-list">
              {card.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            {card.title !== 'Top Attacked Endpoints' && (
              <Link to={card.link} className="card-link">View More</Link>
            )}
          </div>
        ))}

        <div className="card geo-card">
          <h2 className="card-title">Targeted Website Endpoints</h2>
          <EndpointPieChart data={data.endpoints} />
        </div>

        <div className="card geo-card">
          <h2 className="card-title">Attack Attempt Analytics</h2>
          <AttacksPerDayChart data={attacksPerDayData} />
        </div>

        <div className="card geo-card">
          <h2 className="card-title">Top SQL Injection Sources</h2>
          <TopAttackerBarChart data={data.sqliIps} />
        </div>

        <div className="card geo-card">
          <h2 className="card-title">SQLi Attempts by Time of Day</h2>
          <AttacksByHourChart data={attacksByHourData} />
        </div>

        <div className="card geo-card">
          <h2 className="card-title">Geographical Overview</h2>
          <div className="geo-inner">
            <div className="geo-buttons">
              {['north-america', 'south-america', 'africa', 'asia', 'europe', 'antarctica', 'australia'].map(continent => (
                <button
                  key={continent}
                  className={`sidebar-button btn-${continent}`}
                  onClick={() => handleContinentClick(continent)}
                  onMouseEnter={() => setHoveredContinent(continent)}
                  onMouseLeave={() => setHoveredContinent(null)}
                >
                  {continent.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                </button>
              ))}
            </div>
            <div className="geo-container" onMouseOut={hideTooltip}>
              <div className="geo-map-wrapper">
                <img src={continentsMap} alt="Continents Map" className="geo-image" />
                {[{ x: 25, y: 39, key: 'north-america' }, { x: 36, y: 63, key: 'south-america' }, { x: 57, y: 32, key: 'europe' }, { x: 56, y: 54, key: 'africa' }, { x: 77, y: 29, key: 'asia' }, { x: 84, y: 67, key: 'australia' }, { x: 64, y: 96, key: 'antarctica' }].map((dot, i) => (
                  <div
                    key={i}
                    className={`geo-number ${hoveredContinent === dot.key ? 'highlight' : ''}`}
                    style={{ left: `${dot.x}%`, top: `${dot.y}%` }}
                  >
                    {continentStats[dot.key] ?? 0}%
                  </div>
                ))}
              </div>
              {tooltip.visible && (
                <div className="tooltip" style={{ left: tooltip.x, top: tooltip.y }}>
                  {tooltip.text}
                </div>
              )}
            </div>
          </div>

          {activeContinent && (
            <div className="card geo-card">
              <h2 className="card-title">
                IPs from {activeContinent.replace('-', ' ').toUpperCase()}
              </h2>
              <ul className="card-list">
                {continentIps.length > 0 ? (
                  continentIps.map(({ ip, location }) => (
                    <li key={ip}>
                      <Link to={`/ip/${ip}`} className="card-link">{ip}</Link> – {location}
                    </li>
                  ))
                ) : (
                  <li>No logs found for this region.</li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

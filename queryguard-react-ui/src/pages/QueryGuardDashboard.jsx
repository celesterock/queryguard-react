import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo_white.png';
import continentsMap from '../assets/continents.png';
import '../styles/QueryGuardDashboard.css';
import EndpointPieChart from './EndpointPieChart';
import AttacksPerDayChart from './AttacksPerDayChart';
import TopAttackerBarChart from './TopAttackerBarChart';
import AttacksByHourChart from './AttacksByHourChart';

export default function QueryGuardDashboard() {
  const [data, setData] = useState({
    common: [],
    recent: [],
    ips: [],
    endpoints: [],
    sqliIps: []
  });

  const [attacksPerDayData, setAttacksPerDayData] = useState([]);
  const [attacksByHourData, setAttacksByHourData] = useState([]);
  const [error, setError] = useState(null);

  const [continentStats, setContinentStats] = useState({});
  const [hoveredContinent, setHoveredContinent] = useState(null);
  const [tooltip, setTooltip] = useState({ visible: false, text: '', x: 0, y: 0 });

  useEffect(() => {
    Promise.all([
      fetch('http://3.149.254.38:3000/api/common-injections', { credentials: 'include' }).then(res => res.json()),
      fetch('http://3.149.254.38:3000/api/recent-injections', { credentials: 'include' }).then(res => res.json()),
      fetch('http://3.149.254.38:3000/api/most-recent-ips', { credentials: 'include' }).then(res => res.json()),
      fetch('http://3.149.254.38:3000/api/top-attacked-endpoints', { credentials: 'include' }).then(res => res.json()),
      fetch('http://3.149.254.38:3000/api/top-sqli-ips', { credentials: 'include' }).then(res => res.json())
    ])
      .then(([common, recent, ips, endpoints, sqliIps]) => {
        setData({
          common: common.slice(0, 5).map(row => {
            const body = typeof row.injection === 'string'
              ? row.injection
              : JSON.stringify(row.injection);
            return `${body} (${row.count})`;
          }),
          recent: recent.slice(0, 5).map(row => row.injection),
          ips: ips.slice(0, 5),
          endpoints: endpoints.slice(0, 5).map(row => ({
            label: `${row.endpoint} (${row.count})`,
            raw: row.endpoint
          })),
          sqliIps: sqliIps || []
        });
      })
      .catch((err) => {
        console.error('Dashboard data load failed:', err);
        setError('Failed to load dashboard data.');
      });

    fetch('http://3.149.254.38:3000/api/chart/injections-per-day', { credentials: 'include' })
      .then(res => res.json())
      .then(chartLogs => {
        const attacksByDay = {};
        chartLogs.forEach(row => {
          if (Number(row.prediction) === 1) {
            const day = new Date(row.timestamp).toISOString().split('T')[0];
            attacksByDay[day] = (attacksByDay[day] || 0) + 1;
          }
        });

        const attacksData = Object.entries(attacksByDay).map(([date, count]) => ({ date, count }));
        setAttacksPerDayData(attacksData);
      });

    fetch('http://3.149.254.38:3000/api/injections-by-hour', { credentials: 'include' })
      .then(res => res.json())
      .then(hourData => setAttacksByHourData(hourData))
      .catch(err => {
        console.error('Error loading hourly data:', err.message);
      });

    fetch('http://3.149.254.38:3000/api/continent-stats', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setContinentStats(data))
      .catch(err => console.error('Failed to load continent stats:', err));

  }, []);

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

  const showTooltip = (e, text) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({
      visible: true,
      text,
      x: e.clientX - rect.left + 10,
      y: e.clientY - rect.top + 10,
    });
  };
  const hideTooltip = () => setTooltip(t => ({ ...t, visible: false }));

  return (
    <div>
      <div className="dashboard-header">
        <img src={logo} alt="QueryGuard Logo" className="dashboard-logo" />
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

        {/* Map-based geo analytics */}
        <div className="card geo-card">
          <h2 className="card-title">Geographical Overview</h2>
          <div className="geo-inner">
            <div className="geo-buttons">
              {['north-america', 'south-america', 'africa', 'asia', 'europe', 'antarctica', 'australia'].map(continent => (
                <button
                  key={continent}
                  className={`sidebar-button btn-${continent}`}
                  onMouseEnter={() => setHoveredContinent(continent)}
                  onMouseLeave={() => setHoveredContinent(null)}
                >
                  {continent.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                </button>
              ))}
            </div>
            <div className="geo-container" onMouseOut={hideTooltip}>
              <div className="geo-map-wrapper">
                <img
                  src={continentsMap}
                  alt="7 Continents Map"
                  className="geo-image"
                />



{[
  { x: 15, y: 22, key: 'north-america' },
  { x: 26, y: 61, key: 'south-america' },
  { x: 50, y: 19, key: 'europe' },
  { x: 53, y: 44, key: 'africa' },
  { x: 74, y: 17, key: 'asia' },
  { x: 88, y: 59, key: 'australia' },
  { x: 62, y: 95, key: 'antarctica' },
].map((dot, i) => (
  <div
    key={i}
    className={`geo-number ${hoveredContinent === dot.key ? 'highlight' : ''}`}
    style={{
      left: `${dot.x}%`,
      top: `${dot.y}%`
    }}
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
        </div>
      </div>
    </div>
  );
}

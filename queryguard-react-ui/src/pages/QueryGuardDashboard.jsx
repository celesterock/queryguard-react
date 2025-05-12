// src/components/QueryGuardDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import continentsMap from '../assets/continents.png';
import '../styles/QueryGuardDashboard.css';

export default function QueryGuardDashboard() {
  const [data, setData] = useState({
    common: [],
    recent: [],
    ips: [],
    endpoints: []
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch('http://3.149.254.38:3000/api/common-injections', { credentials: 'include' }).then(res => res.json()),
      fetch('http://3.149.254.38:3000/api/recent-injections', { credentials: 'include' }).then(res => res.json()),
      fetch('http://3.149.254.38:3000/api/most-recent-ips', { credentials: 'include' }).then(res => res.json()),
      fetch('http://3.149.254.38:3000/api/top-attacked-endpoints', { credentials: 'include' }).then(res => res.json()),
    ])
      .then(([common, recent, ips, endpoints]) => {
        setData({
          common: common.slice(0,5).map(row => {
            const body = typeof row.injection === 'string'
              ? row.injection
              : JSON.stringify(row.injection);
            return `${body} (${row.count})`;
          }),
          recent: recent.slice(0,5).map(row => row.injection), // show all
          ips: ips.slice(0,5),
	  endpoints: endpoints.slice(0, 5).map(row => ({
		label: `${row.endpoint} (${row.count})`,
		raw: row.endpoint
	  }))
        });
      })
      .catch((err) => {
        console.error('Dashboard data load failed:', err);
        setError('Failed to load dashboard data.');
      });
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
       <Link to={`/endpoint/${encodeURIComponent(item.raw)}`}>
          {item.label}
        </Link>
      )),
      link: '/endpoint-details'	
    },
  ];

  const [tooltip, setTooltip] = useState({
    visible: false,
    text: '',
    x: 0,
    y: 0,
  });

  const showTooltip = (e, text) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({
      visible: true,
      text,
      x: e.clientX - rect.left + 10,
      y: e.clientY - rect.top + 10,
    });
  };

  const hideTooltip = () =>
    setTooltip(t => ({ ...t, visible: false }));

  return (
    <div>
      {/* Header with logo */}
      <div className="dashboard-header">
        <img src={logo} alt="QueryGuard Logo" className="dashboard-logo" />
      </div>

      {/* Grid wrapper for all cards */}
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

        {/* Geographical Overview card */}
        <div className="card geo-card">
          <h2 className="card-title">Geographical Overview</h2>
          <div className="geo-container" onMouseOut={hideTooltip}>
            <img
              src={continentsMap}
              alt="7 Continents Map"
              useMap="#continents"
              className="geo-image"
            />
            <map name="continents">
              {[
                ['70,40,160,130', 'North America: 25%'],
                ['180,130,280,200', 'South America: 10%'],
                ['320,70,410,130', 'Europe: 20%'],
                ['430,90,530,180', 'Africa: 15%'],
                ['550,40,670,130', 'Asia: 20%'],
                ['700,200,780,280', 'Australia: 8%'],
                ['350,300,450,370', 'Antarctica: 2%'],
              ].map(([coords, label]) => (
                <area
                  key={coords}
                  shape="rect"
                  coords={coords}
                  onMouseOver={e => showTooltip(e, label)}
                />
              ))}
            </map>
            {tooltip.visible && (
              <div
                className="tooltip"
                style={{ left: tooltip.x, top: tooltip.y }}
              >
                {tooltip.text}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

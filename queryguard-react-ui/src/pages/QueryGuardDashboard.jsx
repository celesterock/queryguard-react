// src/components/QueryGuardDashboard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import continentsMap from '../assets/continents.png';
import '../styles/QueryGuardDashboard.css';

const cardData = [
  { title: 'Most Recent IP Addresses',    items: ['192.168.0.1', '203.0.113.42', '10.0.0.2'],    link: '/ip-details' },
  { title: 'Most Recent SQL Injections',  items: ["' OR '1'='1", 'DROP TABLE users;', '-- Comment'], link: '/recent-injections' },
  { title: 'Most Common SQL Injections',  items: ["' OR '1'='1 (85%)", 'UNION SELECT (10%)', 'DROP TABLE (5%)'], link: '/common-injections' },
  { title: 'Suspicious Account Names',    items: ['admin_test', 'sql_h4ck3r', 'guest123'],           link: '/suspicious-accounts' },
  { title: 'Compromised Account Names',   items: ['user123', 'foo_bar', 'test_account'],             link: '/compromised-accounts' },
  { title: 'Compromised Data Sources',    items: ['Database A', 'Customer Table', 'Employee Records'], link: '/data-sources' },
];

export default function QueryGuardDashboard() {
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
      {/* Header with large logo above centered title */}
      <div className="dashboard-header">
        <img
          src={logo}
          alt="QueryGuard Logo"
          className="dashboard-logo"
        />
      </div>
      {/* Grid wrapper for all cards */}
      <div className="cards-container">
        {/* Standard data cards */}
        {cardData.map(card => (
          <div key={card.title} className="card">
            <h2 className="card-title">{card.title}</h2>
            <ul className="card-list">
              {card.items.map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <Link to={card.link} className="card-link">
              View More
            </Link>
          </div>
        ))}

        {/* Geographical Overview card */}
        <div className="card geo-card">
          <h2 className="card-title">
            Geographical Overview
          </h2>
          <div
            className="geo-container"
            onMouseOut={hideTooltip}
          >
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

import React, { useState } from 'react';
import "../styles/QueryGuardDashboard.css";
import { Link } from 'react-router-dom';

const cardData = [
  {
    title: 'Most Recent IP Addresses',
    items: ['192.168.0.1', '203.0.113.42', '10.0.0.2'],
    link: 'ip-details.html',
  },
  {
    title: 'Most Recent SQL Injections',
    items: ["' OR '1'='1", 'DROP TABLE users;', '-- Comment'],
    link: 'recent-injections.html',
  },
  {
    title: 'Most Common SQL Injections',
    items: ["' OR '1'='1 (85%)", 'UNION SELECT (10%)', 'DROP TABLE (5%)'],
    link: 'common-injections.html',
  },
  {
    title: 'Suspicious Account Names',
    items: ['admin_test', 'sql_h4ck3r', 'guest123'],
    link: 'suspicious-accounts.html',
  },
  {
    title: 'Compromised Account Names',
    items: ['user_x', 'dev_root', 'janedoe'],
    link: 'compromised-accounts.html',
  },
  {
    title: 'Compromised Data Sources',
    items: ['Database A', 'Customer Table', 'Employee Records'],
    link: 'data-sources.html',
  },
];

export default function QueryGuardDashboard() {
  const [tooltip, setTooltip] = useState({ text: '', x: 0, y: 0, visible: false });

  const showTooltip = (e, text) => {
    setTooltip({ text, x: e.pageX + 10, y: e.pageY - 10, visible: true });
  };

  const hideTooltip = () => {
    setTooltip(t => ({ ...t, visible: false }));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-center text-4xl font-bold mb-8 bg-gradient-to-r from-blue-500 to-green-400 bg-clip-text text-transparent">
        QueryGuard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cardData.map(({ title, items, link }) => (
          <div key={title} className="relative bg-white p-6 rounded-2xl shadow">
            <h2 className="text-lg font-semibold mb-4">{title}</h2>
            <div className="mb-4">
              {items.map((item, idx) => (
                <div key={idx}>{item}</div>
              ))}
            </div>
            <Link
 		          to={`/${link.replace('.html', '')}`}
  		        className="absolute bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-2xl text-center"
	          >
  		        View More
	          </Link>
          </div>
        ))}

        {/* Geographical Overview Card */}
        <div className="relative bg-white p-6 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-4">Geographical Overview</h2>
          <div className="relative">
            <img
              src="continents.png"
              alt="7 Continents Map"
              useMap="#continents"
              className="rounded-2xl"
            />
            <map name="continents">
              <area
                shape="rect"
                coords="70,40,160,130"
                onMouseOver={e => showTooltip(e, 'North America: 25%')}
                onMouseOut={hideTooltip}
              />
              <area
                shape="rect"
                coords="180,130,280,200"
                onMouseOver={e => showTooltip(e, 'South America: 10%')}
                onMouseOut={hideTooltip}
              />
              <area
                shape="rect"
                coords="320,70,410,130"
                onMouseOver={e => showTooltip(e, 'Europe: 20%')}
                onMouseOut={hideTooltip}
              />
              <area
                shape="rect"
                coords="430,90,530,180"
                onMouseOver={e => showTooltip(e, 'Africa: 15%')}
                onMouseOut={hideTooltip}
              />
              <area
                shape="rect"
                coords="550,40,670,130"
                onMouseOver={e => showTooltip(e, 'Asia: 20%')}
                onMouseOut={hideTooltip}
              />
              <area
                shape="rect"
                coords="700,200,780,280"
                onMouseOver={e => showTooltip(e, 'Australia: 8%')}
                onMouseOut={hideTooltip}
              />
              <area
                shape="rect"
                coords="350,300,450,370"
                onMouseOver={e => showTooltip(e, 'Antarctica: 2%')}
                onMouseOut={hideTooltip}
              />
            </map>
            {tooltip.visible && (
              <div
                className="absolute bg-black bg-opacity-50 text-white px-2 py-1 rounded"
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

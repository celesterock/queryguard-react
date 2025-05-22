import React, { useState, useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';

function getWeekStart(dateStr) {
  const date = new Date(dateStr);
  const day = date.getDay(); // 0 (Sun) to 6 (Sat)
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust to Monday
  const monday = new Date(date.setDate(diff));
  return monday.toISOString().split('T')[0]; // 'YYYY-MM-DD'
}

export default function AttacksPerDayChart({ data }) {
  const [view, setView] = useState('daily');

  const groupedData = useMemo(() => {
    if (view === 'daily') {
      return [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    const weekly = {};
    data.forEach(({ date, count }) => {
      const weekStart = getWeekStart(date); // new logic
      weekly[weekStart] = (weekly[weekStart] || 0) + count;
    });

    return Object.entries(weekly)
      .map(([weekStart, count]) => ({
        date: `Week of ${new Date(weekStart).toLocaleDateString('en-US', {
          month: 'short', day: 'numeric'
        })}`,
        sortKey: weekStart,
        count
      }))
      .sort((a, b) => new Date(a.sortKey) - new Date(b.sortKey));
  }, [data, view]);

  return (
    <div style={{ width: '100%', height: 380, padding: '1rem' }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: '1rem'
      }}>
        <h3 style={{ color: '#f7fafc', fontSize: '1.2rem' }}>Attack Frequency ({view})</h3>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['daily', 'weekly'].map(option => (
            <button
              key={option}
              onClick={() => setView(option)}
              style={{
                padding: '0.3rem 0.75rem',
                backgroundColor: view === option ? '#63b3ed' : 'transparent',
                color: '#fff',
                border: '1px solid #63b3ed',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer height={360}>
        <AreaChart
          data={groupedData}
          margin={{ top: 20, right: 30, left: 30, bottom: 60 }}
        >
          <defs>
            <linearGradient id="colorAttack" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#63b3ed" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#63b3ed" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
          <XAxis
            dataKey="date"
            stroke="#cbd5e0"
            angle={-35}
            textAnchor="end"
            height={60}
            label={{ value: 'Date', position: 'insideBottom', offset: -25, fill: '#ffffff' }}
          />
	  <YAxis
	   	stroke="#cbd5e0"
		allowDecimals={false}
  		label={{
    		value: 'Number of SQLi Attempts',
    		angle: -90,
    		position: 'outsideLeft',
    		offset: 15,
    		fill: '#ffffff',
    		fontSize: 12
  		}}
	 />
          <Tooltip contentStyle={{ backgroundColor: '#2d3748', color: '#fff', border: 'none' }} />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#63b3ed"
            fillOpacity={1}
            fill="url(#colorAttack)"
            name="Attack Count"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

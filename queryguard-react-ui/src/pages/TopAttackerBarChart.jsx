import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer, Cell
} from 'recharts';
import { useNavigate } from 'react-router-dom';

export default function TopAttackerBarChart({ data }) {
  const navigate = useNavigate();

  return (
    <div style={{ width: '100%', height: 320, padding: '1rem' }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 10, right: 30, left: 20, bottom: 30 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
          <XAxis
            type="number"
            stroke="#cbd5e0"
            label={{ value: 'SQLi Count', position: 'insideBottom', offset: -5, fill: '#ffffff' }}
          />
          <YAxis
            type="category"
            dataKey="ip"
            stroke="#cbd5e0"
            width={180}
            label={{ value: 'IP Address', angle: 0, position: 'insideLeft', fill: '#ffffff' }}
          />
          <Bar dataKey="count" barSize={18}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill="#63b3ed"
                cursor="pointer"
                onClick={() => navigate(`/ip/${encodeURIComponent(entry.ip)}`)}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

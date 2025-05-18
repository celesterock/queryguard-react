import React from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#63b3ed', '#38a169', '#f6ad55', '#ed64a6', '#9f7aea'];

export default function EndpointPieChart({ data }) {
  const navigate = useNavigate();

  const pieData = data.map(row => ({
    name: row.raw, // raw endpoint path
    value: parseInt(row.label.match(/\((\d+)\)/)?.[1] || 0),
  }));

  return (
    <div style={{ width: '100%', height: 300, padding: '1rem' }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            outerRadius={90}
            dataKey="value"
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
            onClick={(data, index) => {
              const endpoint = pieData[index].name;
              navigate(`/endpoint/${encodeURIComponent(endpoint)}`);
            }}
          >
            {pieData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                cursor="pointer"
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

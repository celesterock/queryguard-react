import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from 'recharts';

export default function SqliByHourChart({ data }) {
  return (
    <div style={{ width: '100%', height: 400, padding: '1rem' }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          layout="horizontal"
          margin={{ top: 10, right: 30, left: 40, bottom: 50 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
          <XAxis
            dataKey="timeRange"
            stroke="#cbd5e0"
            angle={-45}
            textAnchor="end"
            interval={0}
            height={60}
          />
          <YAxis
            type="number"
            stroke="#cbd5e0"
            allowDecimals={false}
            label={{
              value: 'SQLi Attempt Count',
              angle: -90,
              position: 'insideLeft',
              fill: '#a0aec0',
              offset: 10
            }}
          />
          <Bar dataKey="count" fill="#63b3ed" barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

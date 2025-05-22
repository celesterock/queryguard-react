import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from 'recharts';

export default function SqliByHourChart({ data }) {
  return (
    <div style={{ width: '100%', height: 400, padding: '1rem', paddingBottom: '3rem' }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          layout="horizontal"
          margin={{ top: 10, right: 30, left: 40, bottom: 50 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
          <XAxis
            dataKey="timeRange"
            angle={-45}
            textAnchor="end"
            interval={0}
 tick={{ fill: '#ffffff', fontSize: 10 }}
            label={{
              value: "Hour of Day",
              position: "insideBottom",
              offset: -45,
              style: { fill: '#ccc' }
            }}
          />
          <YAxis
            type="number"
            stroke="#cbd5e0"
            allowDecimals={false}
            label={{
              value: 'SQLi Attempt Count',
              angle: -90,
              position: 'insideLeft',
              fill: '#ffffff',
              offset: -10
            }}
          />
          <Bar dataKey="count" fill="#63b3ed" barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}


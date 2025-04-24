import React from 'react';
import { Link } from 'react-router-dom';

export default function IPDetails() {
  const data = ['192.168.0.1', '203.0.113.42', '10.0.0.2'];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Most Recent SQL Injections</h1>
      <ul className="list-disc ml-6 space-y-2">
        {data.map((ip, idx) => (
          <li key={idx}>{ip}</li>
        ))}
      </ul>
      <Link to="/" className="text-blue-500 underline mt-4 block">Back to Dashboard</Link>
    </div>
  );
}
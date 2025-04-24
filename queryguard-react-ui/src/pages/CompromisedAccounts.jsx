import React from 'react';
import { Link } from 'react-router-dom';

export default function CommonInjections() {
  const data = ["' OR '1'='1 (85%)", 'UNION SELECT (10%)', 'DROP TABLE (5%)'];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Compromised Account Names</h1>
      <ul className="list-disc ml-6 space-y-2">
        {data.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
      <Link to="/" className="text-blue-500 underline mt-4 block">Back to Dashboard</Link>
    </div>
  );
}

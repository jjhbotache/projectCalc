import React from 'react';

export default function HourlyRateInput({ hourlyRate, setHourlyRate }) {
  return (
    <div className="pb-4">
      <label className="block mb-2">Hourly Rate (USD)</label>
      <input
        type="number"
        value={hourlyRate}
        onChange={(e) => setHourlyRate(Math.max(1, Number(e.target.value)))}
        className={`w-full max-w-xs p-2 border rounded text-black`}
      />
    </div>
  );
}

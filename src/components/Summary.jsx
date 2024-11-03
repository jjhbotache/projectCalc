import { useState } from 'react';

export default function Summary({ totals, maintenanceCost, darkMode }) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <div className={`summary ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} p-4 rounded-lg shadow-lg mt-8`}>
      <button 
        onClick={toggleExpanded}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
      >
        {expanded ? 'Hide Summary' : 'Show Summary'}
      </button>
      {expanded && (
        <div>
          <h3 className="text-lg font-bold mb-2">Totals</h3>
          <p>Total Days: {totals.days.toFixed(2)}</p>
          <p>Total Tech Cost: {totals.techCost.toFixed(2)}</p>
          <p>Total Labor Cost: {totals.laborCost.toFixed(2)}</p>
          <p>Total Project Cost: {(totals.techCost + totals.laborCost).toFixed(2)}</p>
          <p>Monthly Maintenance Cost: {maintenanceCost.toFixed(2)}</p>
          <p>Total Monthly Cost: {totals.monthlyCost.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
}

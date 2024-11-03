import { useState, useRef } from 'react';
import { Moon, Sun, Copy, Check } from 'lucide-react';
import Sprint from './Sprint';
import JsonInfoDialog from './JsonInfoDialog';
import useDarkMode from '../hooks/useDarkMode';
import { calculateTotals, exportJSON, importJSON } from '../utils/calculate';
import { formatCurrency } from '../utils/format';

export default function ProjectPlanner() {
  const [hourlyRate, setHourlyRate] = useState(30);
  const [sprints, setSprints] = useState([]);
  const [maintenanceCost, setMaintenanceCost] = useState(0);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef();
  const [darkMode, setDarkMode] = useDarkMode();

  const totals = calculateTotals(sprints);

  return (
    <div className={`max-w-6xl mx-auto p-4 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} shadow-lg rounded-lg`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Project Planner</h2>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`p-2 rounded-full ${darkMode ? 'bg-yellow-400 text-gray-800' : 'bg-gray-800 text-yellow-400'}`}
        >
          {darkMode ? <Sun size={24} /> : <Moon size={24} />}
        </button>
      </div>

      <div className="mb-4">
        <label className="block mb-2">Hourly Rate (USD)</label>
        <input
          type="number"
          value={hourlyRate}
          onChange={(e) => setHourlyRate(Math.max(1, Number(e.target.value)))}
          className={`w-full max-w-xs p-2 border rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-white'}`}
        />
      </div>

      {sprints.map((sprint) => (
        <Sprint
          key={sprint.id}
          sprint={sprint}
          updateSprint={updateSprint}
          updateTask={updateTask}
          addTask={addTask}
          removeTask={removeTask}
          removeSprint={removeSprint}
          darkMode={darkMode}
        />
      ))}

      <button 
        onClick={addSprint}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
      >
        Add Sprint
      </button>

      <div className="mt-8">
        <h3 className="text-lg font-bold mb-2">Project Maintenance Cost</h3>
        <label className="block mb-2">Monthly Maintenance Cost (USD)</label>
        <input
          type="number"
          value={maintenanceCost}
          onChange={(e) => setMaintenanceCost(Number(e.target.value))}
          className={`w-full max-w-xs p-2 border rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-white'}`}
        />
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-bold mb-2">Totals</h3>
        <p>Total Days: {totals.days.toFixed(2)}</p>
        <p>Total Tech Cost: {formatCurrency(totals.techCost)}</p>
        <p>Total Labor Cost: {formatCurrency(totals.laborCost)}</p>
        <p>Total Project Cost: {formatCurrency(totals.techCost + totals.laborCost)}</p>
        <p>Monthly Maintenance Cost: {formatCurrency(maintenanceCost)}</p>
        <p>Total Monthly Cost: {formatCurrency(totals.monthlyCost)}</p>
      </div>

      <div className="mt-8 flex space-x-4 flex-wrap">
        <button 
          onClick={() => exportJSON({ hourlyRate, sprints, maintenanceCost })}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
        >
          Export JSON
        </button>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={(e) => importJSON(e, setHourlyRate, setSprints, setMaintenanceCost)}
          accept=".json"
        />
        <button 
          onClick={() => fileInputRef.current.click()}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          Import JSON
        </button>
        <JsonInfoDialog darkMode={darkMode} copied={copied} setCopied={setCopied} />
      </div>
    </div>
  );
}

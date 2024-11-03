import Task from './Task';
import { formatCurrency } from '../utils/format';

export default function Sprint({ sprint, updateSprint, updateTask, addTask, removeTask, removeSprint, darkMode }) {
  return (
    <div className={`mb-8 border p-4 rounded ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>
      <div className={`sticky top-0 z-10 p-5 mb-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm pt-2`}>
        <input
          value={sprint.name}
          onChange={(e) => updateSprint(sprint.id, 'name', e.target.value)}
          className={`text-xl font-bold mb-2 w-full p-2 border rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-white'}`}
        />
        <div className="flex justify-between">
          <span>Duration: {sprint.duration.toFixed(2)} days</span>
          <span>Labor Cost: {formatCurrency(sprint.laborCost)}</span>
        </div>
      </div>
      <table className="w-full mb-4">
        <thead>
          <tr>
            <th className="text-left p-2">Task</th>
            <th className="text-left p-2">Time (days)</th>
            <th className="text-left p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sprint.tasks.map((task, index) => (
            <Task
              key={index}
              task={task}
              sprintId={sprint.id}
              taskIndex={index}
              updateTask={updateTask}
              removeTask={removeTask}
              darkMode={darkMode}
            />
          ))}
        </tbody>
      </table>
      <button 
        onClick={() => addTask(sprint.id)}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-4"
      >
        Add Task
      </button>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-2">Tech Cost (USD)</label>
          <input
            type="number"
            value={sprint.techCost}
            onChange={(e) => updateSprint(sprint.id, 'techCost', Number(e.target.value))}
            className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-white'}`}
          />
        </div>
        <div>
          <label className="block mb-2">Labor Cost (USD)</label>
          <input
            type="number"
            value={(sprint.laborCost || 0).toFixed(2)}
            readOnly
            className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-600 text-white' : 'bg-gray-100'}`}
          />
        </div>
        <div>
          <label className="block mb-2">Monthly Cost (USD)</label>
          <input
            type="number"
            value={sprint.monthlyCost}
            onChange={(e) => updateSprint(sprint.id, 'monthlyCost', Number(e.target.value))}
            className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-white'}`}
          />
        </div>
      </div>
      <button 
        onClick={() => removeSprint(sprint.id)}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mt-4"
      >
        Remove Sprint
      </button>
    </div>
  );
}

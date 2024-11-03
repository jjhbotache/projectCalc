
export default function Task({ task, sprintId, taskIndex, updateTask, removeTask, darkMode }) {
  return (
    <tr>
      <td className="p-2">
        <input
          value={task.name}
          onChange={(e) => updateTask(sprintId, taskIndex, 'name', e.target.value)}
          className={`w-full p-1 border rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-white'}`}
        />
      </td>
      <td className="p-2">
        <input
          type="number"
          value={task.time}
          onChange={(e) => updateTask(sprintId, taskIndex, 'time', Number(e.target.value))}
          className={`w-full p-1 border rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-white'}`}
        />
      </td>
      <td className="p-2">
        <button 
          onClick={() => removeTask(sprintId, taskIndex)}
          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
        >
          Remove
        </button>
      </td>
    </tr>
  );
}
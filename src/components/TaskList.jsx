import Task from './Task';

export default function TaskList({ tasks, sprintId, updateTask, removeTask, darkMode }) {
  return (
    <table className="w-full mb-4">
      <thead>
        <tr>
          <th className="text-left p-2">Task</th>
          <th className="text-left p-2">Time (days)</th>
          <th className="text-left p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task, index) => (
          <Task
            key={index}
            task={task}
            sprintId={sprintId}
            taskIndex={index}
            updateTask={updateTask}
            removeTask={removeTask}
            darkMode={darkMode}
          />
        ))}
      </tbody>
    </table>
  );
}

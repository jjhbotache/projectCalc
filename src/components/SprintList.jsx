import Sprint from './Sprint';

export default function SprintList({ sprints, updateSprint, updateTask, addTask, removeTask, removeSprint, darkMode }) {
  return (
    <div>
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
    </div>
  );
}

import { useRef } from "react";

export default function Navigation({ sprints, onSprintClick }) {
  const ref = useRef(null);

  const handleSprintClick = (element) => {
    onSprintClick(element);
  };

  return (
    <div className="navigation p-4 bg-gray-100 rounded-lg shadow-md w-52 h-full overflow-y-auto ">
      <h2 className="text-xl font-bold mb-4">Navigation</h2>
      <ul className="space-y-2">
        {sprints.map((sprint, index) => (
          <li key={sprint.id}>
            <button
              className="w-full text-left p-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
              onClick={() => handleSprintClick(index)}
            >
              {sprint.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

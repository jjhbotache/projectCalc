import { useState } from 'react';

export default function Navigation({ sprints, onSprintClick }) {
  const [expanded, setExpanded] = useState(null);

  const handleSprintClick = (index) => {
    setExpanded(index === expanded ? null : index);
    onSprintClick(index);
  };

  return (
    <div className="navigation">
      <h2>Navigation</h2>
      <ul>
        {sprints.map((sprint, index) => (
          <li key={sprint.id}>
            <button onClick={() => handleSprintClick(index)}>
              {sprint.name}
            </button>
            {expanded === index && (
              <div className="sprint-details">
                <p>Duration: {sprint.duration.toFixed(2)} days</p>
                <p>Labor Cost: {sprint.laborCost.toFixed(2)}</p>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

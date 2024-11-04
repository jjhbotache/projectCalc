import { useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Copy, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Navigation from './components/Navigation';
import Summary from './components/Summary';
import Header from './components/Header';
import HourlyRateInput from './components/HourlyRateInput';
import SprintList from './components/SprintList';
import JsonInfoDialog from './components/JsonInfoDialog';
import { setHourlyRate, setSprints, setMaintenanceCost } from './slices/projectSlice';
import { useLocalStorage } from './hooks/useLocalStorage';
import { calculateLaborCost, calculateSprintDuration, calculateTotals, exportJSON, importJSON } from './utils/calculate';

export default function ProjectPlanner() {
  const dispatch = useDispatch();
  const hourlyRate = useSelector((state) => state.project.hourlyRate);
  const sprints = useSelector((state) => state.project.sprints);
  const maintenanceCost = useSelector((state) => state.project.maintenanceCost);
  const darkMode = useSelector((state) => state.theme.darkMode);
  const copied = useSelector((state) => state.project.copied);
  const fileInputRef = useRef();

  const [projectData, setProjectData] = useLocalStorage('projectData', { hourlyRate, sprints, maintenanceCost });

  const updateSprint = (id, field, value) => {
    dispatch(setSprints(sprints.map(sprint =>
      sprint.id === id ? { ...sprint, [field]: value } : sprint
    )));
  };

  const updateTask = (sprintId, taskIndex, field, value) => {
    dispatch(setSprints(sprints.map(sprint => {
      if (sprint.id === sprintId) {
        const newTasks = [...sprint.tasks];
        newTasks[taskIndex] = { ...newTasks[taskIndex], [field]: value };
        return {
          ...sprint,
          tasks: newTasks,
          laborCost: calculateLaborCost(newTasks, hourlyRate),
          duration: calculateSprintDuration(newTasks)
        };
      }
      return sprint;
    })));
  };

  const addSprint = () => {
    const newId = sprints.length > 0 ? Math.max(...sprints.map(s => s.id)) + 1 : 1;
    dispatch(setSprints([...sprints, {
      id: newId,
      name: "New Sprint",
      tasks: [],
      techCost: 0,
      laborCost: 0,
      duration: 0,
      monthlyCost: 0
    }]));
  };

  const removeSprint = (id) => {
    dispatch(setSprints(sprints.filter(sprint => sprint.id !== id)));
  };

  const addTask = (sprintId) => {
    dispatch(setSprints(sprints.map(sprint => {
      if (sprint.id === sprintId) {
        const newTasks = [...sprint.tasks, { name: "New Task", time: 0 }];
        return {
          ...sprint,
          tasks: newTasks,
          laborCost: calculateLaborCost(newTasks, hourlyRate),
          duration: calculateSprintDuration(newTasks)
        };
      }
      return sprint;
    })));
  };

  const removeTask = (sprintId, taskIndex) => {
    dispatch(setSprints(sprints.map(sprint => {
      if (sprint.id === sprintId) {
        const newTasks = sprint.tasks.filter((_, index) => index !== taskIndex);
        return {
          ...sprint,
          tasks: newTasks,
          laborCost: calculateLaborCost(newTasks, hourlyRate),
          duration: calculateSprintDuration(newTasks)
        };
      }
      return sprint;
    })));
  };

  const totals = calculateTotals(sprints);

  const handleSprintClick = (index) => {
    const sprintElement = document.getElementById(`sprint-${index}`);
    if (sprintElement) {
      sprintElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex h-screen scroll-smooth">
      <Navigation sprints={sprints} onSprintClick={handleSprintClick} />
      <div className={`p-4 w-full h-full overflow-y-auto scroll-smooth ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} shadow-lg rounded-lg`}>
        <Header />
        <HourlyRateInput hourlyRate={hourlyRate} setHourlyRate={(rate) => dispatch(setHourlyRate(rate))} />
        <SprintList
          sprints={sprints}
          updateSprint={updateSprint}
          updateTask={updateTask}
          addTask={addTask}
          removeTask={removeTask}
          removeSprint={removeSprint}
          darkMode={darkMode}
        />
        <button
          onClick={addSprint}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
        >
          Add Sprint
        </button>
        <Summary totals={totals} maintenanceCost={maintenanceCost} darkMode={darkMode} />
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
            onChange={(e) => importJSON(e, dispatch, setHourlyRate, setSprints, setMaintenanceCost)}
            accept=".json"
          />
          <button
            onClick={() => fileInputRef.current.click()}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            Import JSON
          </button>
          <JsonInfoDialog darkMode={darkMode} copied={copied} setCopied={(value) => dispatch(setCopied(value))} />
        </div>
      </div>
    </div>
  );
}

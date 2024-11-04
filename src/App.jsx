import { useRef, useEffect, useCallback } from 'react';
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

export default function ProjectPlanner() {
  const dispatch = useDispatch();
  const hourlyRate = useSelector((state) => state.project.hourlyRate);
  const sprints = useSelector((state) => state.project.sprints);
  const maintenanceCost = useSelector((state) => state.project.maintenanceCost);
  const darkMode = useSelector((state) => state.theme.darkMode);
  const copied = useSelector((state) => state.project.copied);
  const fileInputRef = useRef();

  useEffect(() => {
    const savedProject = localStorage.getItem('projectData');
    if (savedProject) {
      const parsedProject = JSON.parse(savedProject);
      dispatch(setHourlyRate(parsedProject.hourlyRate));
      dispatch(setSprints(parsedProject.sprints));
      dispatch(setMaintenanceCost(parsedProject.maintenanceCost));
    }
  }, [dispatch]);

  useEffect(() => {
    const projectData = { hourlyRate, sprints, maintenanceCost };
    localStorage.setItem('projectData', JSON.stringify(projectData));
  }, [hourlyRate, sprints, maintenanceCost]);

  const calculateLaborCost = useCallback((tasks) => {
    const totalHours = tasks.reduce((sum, task) => sum + task.time, 0) * 8; // Assuming 8 hours per day
    return totalHours * hourlyRate;
  }, [hourlyRate]);

  const calculateSprintDuration = (tasks) => {
    return tasks.reduce((sum, task) => sum + task.time, 0); // Sum of all task times
  };

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
          laborCost: calculateLaborCost(newTasks),
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
          laborCost: calculateLaborCost(newTasks),
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
          laborCost: calculateLaborCost(newTasks),
          duration: calculateSprintDuration(newTasks)
        };
      }
      return sprint;
    })));
  };

  const calculateTotals = () => {
    return sprints.reduce((acc, sprint) => ({
      days: acc.days + sprint.duration,
      techCost: acc.techCost + sprint.techCost,
      laborCost: acc.laborCost + (sprint.laborCost || 0),
      monthlyCost: acc.monthlyCost + (sprint.monthlyCost || 0)
    }), { days: 0, techCost: 0, laborCost: 0, monthlyCost: 0 });
  };

  const totals = calculateTotals();

  const exportJSON = () => {
    const dataStr = JSON.stringify({ hourlyRate, sprints, maintenanceCost }, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = 'project-plan.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importJSON = (event) => {
    const file = event.target.files[0];
    if (!file) {
      console.error("No file selected");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target.result;
        const parsedContent = JSON.parse(content);

        if (parsedContent.hourlyRate !== undefined) {
          dispatch(setHourlyRate(parsedContent.hourlyRate));
        } else {
          console.error("hourlyRate not found in JSON");
        }

        if (Array.isArray(parsedContent.sprints)) {
          dispatch(setSprints(parsedContent.sprints.map(sprint => ({
            ...sprint,
            laborCost: calculateLaborCost(sprint.tasks),
            duration: calculateSprintDuration(sprint.tasks)
          }))));
        } else {
          console.error("sprints not found or not an array in JSON");
        }

        dispatch(setMaintenanceCost(parsedContent.maintenanceCost || 0));
      } catch (error) {
        console.error("Error parsing JSON file:", error);
      }
    };

    reader.onerror = (error) => {
      console.error("Error reading file:", error);
    };

    reader.readAsText(file);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const handleSprintClick = (index) => {
    const sprintElement = document.getElementById(`sprint-${index}`);
    if (sprintElement) {
      sprintElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex h-screen scroll-smooth">
      <Navigation sprints={sprints} onSprintClick={handleSprintClick} />
      <div className={`p-4 pt-0 w-full h-full overflow-y-auto scroll-smooth ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} shadow-lg rounded-lg`}>
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
            onClick={exportJSON}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          >
            Export JSON
          </button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={importJSON}
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

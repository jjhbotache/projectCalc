import { useState, useRef, useEffect, useCallback } from 'react';
import { Moon, Sun, Copy, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Navigation from './components/Navigation';
import Summary from './components/Summary';

export default function ProjectPlanner (){
  const [hourlyRate, setHourlyRate] = useState(30);
  const [sprints, setSprints] = useState([]);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });
  const [maintenanceCost, setMaintenanceCost] = useState(0);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef();

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  useEffect(() => {
    const savedProject = localStorage.getItem('projectData');
    if (savedProject) {
      const parsedProject = JSON.parse(savedProject);
      setHourlyRate(parsedProject.hourlyRate);
      setSprints(parsedProject.sprints);
      setMaintenanceCost(parsedProject.maintenanceCost);
    }
  }, []);

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
    setSprints(sprints.map(sprint => 
      sprint.id === id ? { ...sprint, [field]: value } : sprint
    ));
  };

  const updateTask = (sprintId, taskIndex, field, value) => {
    setSprints(sprints.map(sprint => {
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
    }));
  };

  const addSprint = () => {
    const newId = sprints.length > 0 ? Math.max(...sprints.map(s => s.id)) + 1 : 1;
    setSprints([...sprints, { 
      id: newId, 
      name: "New Sprint", 
      tasks: [], 
      techCost: 0, 
      laborCost: 0,
      duration: 0,
      monthlyCost: 0
    }]);
  };

  const removeSprint = (id) => {
    setSprints(sprints.filter(sprint => sprint.id !== id));
  };

  const addTask = (sprintId) => {
    setSprints(sprints.map(sprint => {
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
    }));
  };

  const removeTask = (sprintId, taskIndex) => {
    setSprints(sprints.map(sprint => {
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
    }));
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
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
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
          setHourlyRate(parsedContent.hourlyRate);
        } else {
          console.error("hourlyRate not found in JSON");
        }
  
        if (Array.isArray(parsedContent.sprints)) {
          setSprints(parsedContent.sprints.map(sprint => ({
            ...sprint,
            laborCost: calculateLaborCost(sprint.tasks),
            duration: calculateSprintDuration(sprint.tasks)
          })));
        } else {
          console.error("sprints not found or not an array in JSON");
        }
  
        setMaintenanceCost(parsedContent.maintenanceCost || 0);
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

  const jsonStructure = `{
  "hourlyRate": number,
  "maintenanceCost": number,
  "sprints": [
    {
      "id": number,
      "name": string,
      "tasks": [
        {
          "name": string,
          "time": number
        }
      ],
      "techCost": number,
      "duration": number
    }
  ]
  }`;

  const copyJsonStructure = () => {
    navigator.clipboard.writeText(jsonStructure);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSprintClick = (index) => {
    const sprintElement = document.getElementById(`sprint-${index}`);
    if (sprintElement) {
      sprintElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex">
      <Navigation sprints={sprints} onSprintClick={handleSprintClick} />
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

        {sprints.map((sprint, index) => (
          <div key={sprint.id} id={`sprint-${index}`} className={`mb-8 border p-4 rounded ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>
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
                  <tr key={index}>
                    <td className="p-2">
                      <input
                        value={task.name}
                        onChange={(e) => updateTask(sprint.id, index, 'name', e.target.value)}
                        className={`w-full p-1 border rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-white'}`}
                        title={task.name}
                        />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        value={task.time}
                        onChange={(e) => updateTask(sprint.id, index, 'time', Number(e.target.value))}
                        className={`w-full p-1 border rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-white'}`}
                      />
                    </td>
                    <td className="p-2">
                      <button 
                        onClick={() => removeTask(sprint.id, index)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
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
        ))}

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
          <Dialog>
            <DialogTrigger asChild>
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                JSON Info
              </button>
            </DialogTrigger>
            <DialogContent className={darkMode ? 'bg-gray-800 text-white' : 'bg-white'}>
              <DialogHeader>
                <DialogTitle>JSON Structure for Import/Export</DialogTitle>
              </DialogHeader>
              <div className="mt-2">
                <p>The JSON file for import/export follows this structure:</p>
                <div className="relative">
                  <pre className={`mt-2 p-2 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    {jsonStructure}
                  </pre>
                  <button
                    onClick={copyJsonStructure}
                    className="absolute top-2 right-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
                <p className="mt-2">This structure allows for easy import and export of your project planning data, including maintenance costs.</p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

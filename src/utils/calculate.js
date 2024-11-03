export const calculateLaborCost = (tasks, hourlyRate) => {
  const totalHours = tasks.reduce((sum, task) => sum + task.time, 0) * 8; // Assuming 8 hours per day
  return totalHours * hourlyRate;
};

export const calculateSprintDuration = (tasks) => {
  return tasks.reduce((sum, task) => sum + task.time, 0); // Sum of all task times
};

export const calculateTotals = (sprints) => {
  return sprints.reduce((acc, sprint) => ({
    days: acc.days + sprint.duration,
    techCost: acc.techCost + sprint.techCost,
    laborCost: acc.laborCost + (sprint.laborCost || 0),
    monthlyCost: acc.monthlyCost + (sprint.monthlyCost || 0)
  }), { days: 0, techCost: 0, laborCost: 0, monthlyCost: 0 });
};

export const exportJSON = ({ hourlyRate, sprints, maintenanceCost }) => {
  const dataStr = JSON.stringify({ hourlyRate, sprints, maintenanceCost }, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  const exportFileDefaultName = 'project-plan.json';

  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
};

export const importJSON = (event, setHourlyRate, setSprints, setMaintenanceCost) => {
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
          laborCost: calculateLaborCost(sprint.tasks, parsedContent.hourlyRate),
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

export const calculateTotalMonthlyCost = (sprints) => {
  return sprints.reduce((total, sprint) => total + (sprint.monthlyCost || 0), 0);
};

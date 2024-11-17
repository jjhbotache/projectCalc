export const calculateLaborCost = (tasks, hourlyRate) => {
  const totalHours = tasks.reduce((sum, task) => sum + task.time, 0) * 8; // Assuming 8 hours per day
  return totalHours * hourlyRate;
};

export const calculateFunctionalityDuration = (tasks) => {
  return tasks.reduce((sum, task) => sum + task.hours, 0); // Sum of all task times
};

export const calculateTotalMonthlyCost = (functionalities) => {
  return functionalities.reduce((total, functionality) => total + (functionality.monthlyCost || 0), 0);
};

export const calculateTotals = (project, settings) => {
  
  const { functionalities } = project;



  let totalTechCost = 0;
  let totalLaborCost = 0;
  let totalMonthlyCost = 0;
  
  let totalHours = 0;
  functionalities.forEach(func => {
    func.tasks.forEach(task => {
      totalHours += task.hours;
    });
    const { techCost, laborCost, monthlyCost } = calculateFunctionTotalPrices(func, settings.hourlyRate);
    
    totalTechCost += techCost;
    totalLaborCost += laborCost;
    totalMonthlyCost += monthlyCost;
  });

  const { hoursPerDay, workingDaysPerWeek } = settings;
  
  const totalDays = totalHours / hoursPerDay;
  const totalWeeks = totalDays / workingDaysPerWeek;
  const totalMonths = totalWeeks / 4;
  
  const daysPerMonth = settings.workingDaysPerWeek * 4;
  
  const totalProjectCost = totalTechCost + totalLaborCost;


  return {
    hours: totalHours,
    days: totalDays,
    weeks: totalWeeks,
    months: totalMonths,

    techCost: totalTechCost,
    laborCost: totalLaborCost,
    projectCost: totalProjectCost,
    monthlyCost: totalMonthlyCost,
  };
};

// ---------------------

export function calculateFunctionTotalPrices(functionality, pricePerHour) {
  const laborCost = functionality.tasks
    .filter(task => task.billed)
    .reduce((acc, task) => acc + task.hours, 0) * pricePerHour;

  return {
    totalPrice: laborCost + functionality.techCost,
    laborCost: laborCost,
    monthlyCost: functionality.monthlyCost,
    techCost: functionality.techCost
  }
}


export const calculateTaskDifferences = (currentTasks, updatedTasks) => {
  const allTasks = [...currentTasks, ...updatedTasks];

  const diffs = allTasks.map((task) => {
      let status = '';
      let hours = task.hours;

      if (!currentTasks.find((t) => t.name === task.name)) {
          status = 'added';
      } else if (!updatedTasks.find((t) => t.name === task.name)) {
          status = 'removed';
      } else {
          const currentTask = currentTasks.find((t) => t.name === task.name);
          const updatedTask = updatedTasks.find((t) => t.name === task.name);
          const hourDifference = updatedTask.hours - currentTask.hours;

          if (hourDifference === 0) {
              status = 'not modified';
          } else {
              status = 'edited';
              hours = hourDifference;
          }
      }

      return { ...task, status, hours };
  });

  return diffs.filter((task, index) => index === diffs.findIndex((t) => t.name === task.name));
};

export const calculateProjectDifferences = (currentProject, newProject) => {
  const currentFunctionalities = currentProject.functionalities;
  const newFunctionalities = newProject.functionalities;

  let differences = [];

  newFunctionalities.forEach((func) => {
      if (!currentFunctionalities.find((f) => f.id === func.id)) {
          differences.push({ type: 'added', functionality: func });
      }
  });

  currentFunctionalities.forEach((func) => {
      if (!newFunctionalities.find((f) => f.id === func.id)) {
          differences.push({ type: 'removed', functionality: func });
      }
  });

  newFunctionalities.forEach((func) => {
      const currentFunc = currentFunctionalities.find((f) => f.id === func.id);
      if (currentFunc) {
          if (JSON.stringify(currentFunc) !== JSON.stringify(func)) {

              const taskDifferences = calculateTaskDifferences(currentFunc.tasks, func.tasks);
              console.log(currentFunc.tasks, func.tasks);
              console.log(taskDifferences);

              differences.push({
                  type: 'edited',
                  functionality: func,
                  taskDifferences: taskDifferences,
              });
          }
      }
  });

  // Calculate configuration differences
  const currentConfig = currentProject.config || {};
  const newConfig = newProject.config || {};

  // Check for added configurations
  Object.keys(newConfig).forEach((key) => {
      if (!currentConfig.hasOwnProperty(key)) {
          differences.push({ type: 'added', key, value: newConfig[key] });
      }
  });

  // Check for removed configurations
  Object.keys(currentConfig).forEach((key) => {
      if (!newConfig.hasOwnProperty(key)) {
          differences.push({ type: 'removed', key, value: currentConfig[key] });
      }
  });

  // Check for edited configurations
  Object.keys(newConfig).forEach((key) => {
      if (
          currentConfig.hasOwnProperty(key) &&
          currentConfig[key] !== newConfig[key]
      ) {
          differences.push({
              type: 'edited',
              key,
              oldValue: currentConfig[key],
              newValue: newConfig[key],
          });
      }
  });

  differences = differences.sort((a, b) => a.functionality?.id - b.functionality?.id || 0);
  console.log(differences);

  return differences;
};

export const calculateConfigurationDifferences = (currentConfig = {}, newConfig = {}) => {
  let differences = [];

  // Check for added configurations
  Object.keys(newConfig).forEach((key) => {
      if (!currentConfig.hasOwnProperty(key)) {
          differences.push({ type: 'added', key, value: newConfig[key] });
      }
  });

  // Check for removed configurations
  Object.keys(currentConfig).forEach((key) => {
      if (!newConfig.hasOwnProperty(key)) {
          differences.push({ type: 'removed', key, value: currentConfig[key] });
      }
  });

  // Check for edited configurations
  Object.keys(newConfig).forEach((key) => {
      if (
          currentConfig.hasOwnProperty(key) &&
          currentConfig[key] !== newConfig[key]
      ) {
          differences.push({
              type: 'edited',
              key,
              oldValue: currentConfig[key],
              newValue: newConfig[key],
          });
      }
  });

  return differences;
};
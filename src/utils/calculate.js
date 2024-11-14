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
  /*
  {
      id: 0,
      name: 'Default Functionality',
      tasks: [
        {
          name: 'Default Task',
          hours: 0,
          billed: true,
        },
      ],
      techCost: 0,
      laborCost: 0,
      duration: 0,
      monthlyCost: 0,
    },
   */
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


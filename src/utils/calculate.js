import { calculateFunctionTotalPrices } from "./calculateTotalPrices";

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



  let totalDays = 0;
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
  
  totalDays = totalHours / settings.hoursPerDay;
  
  const totalProjectCost = totalTechCost + totalLaborCost;


  return {
    hours: totalHours,
    days: totalDays,
    techCost: totalTechCost,
    laborCost: totalLaborCost,
    projectCost: totalProjectCost,
    monthlyCost: totalMonthlyCost,
  };
};


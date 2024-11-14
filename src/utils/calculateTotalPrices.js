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

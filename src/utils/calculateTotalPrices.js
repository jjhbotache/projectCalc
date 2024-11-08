export function calculateFunctionTotalPrices(functionality,pricePerHour) {
  /*
  {
    "id": 7,
    "name": "backend para agendar",
    "tasks": [
        {
            "name": "configurar django",
            "hours": 3
        }
    ],
    "techCost": 0,
    "laborCost": 0,
    "duration": 0,
    "monthlyCost": 0
  }
   */
  const laborCost = functionality.tasks.reduce((acc, task) => acc + task.hours, 0) * pricePerHour;

  return {
    totalPrice: laborCost + functionality.techCost,
    laborCost: laborCost,
    monthlyCost: functionality.monthlyCost,
    techCost: functionality.techCost
  }
}

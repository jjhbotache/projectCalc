import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

export const initialFunctionality = {
  id: 0,
  name: 'Default Functionality',
  tasks: [
    {
      id: 0, // Start with ID 0
      name: 'Default Task',
      hours: 0,
      billed: true,
    },
  ],
  techCost: 0,
  laborCost: 0,
  duration: 0,
  monthlyCost: 0,
};

export const initialState = {
  functionalities: [
    initialFunctionality,    
  ],
  projectInfo:{
    id: 0,
    projectName: 'My Project',
    projectDescription: '',
    technologiesUsed: [
      "example technology 1",
    ],
    deliverables: [
      "example deliverable"
    ],
  }
};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    updateFunctionalities: (state, action) => {
      const { type, payload } = action.payload;

      switch (type) {
        case 'SET_ALL':
          state.functionalities = payload;
          break;
        case 'UPDATE_ONE':
          const functionality = state.functionalities.find(f => f.id === payload.id);
          if (functionality) {
            Object.assign(functionality, payload.updates);
          }
          break;
        case 'ADD_FUNCTIONALITY':
          state.functionalities.push(payload);
          break;
        case 'REMOVE_FUNCTIONALITY':
          state.functionalities = state.functionalities.filter(f => f.id !== payload.id);
          break;
        case 'UPDATE_TASK':
          const funcToUpdate = state.functionalities.find(f => f.id === payload.functionalityId);
          if (funcToUpdate && funcToUpdate.tasks[payload.taskIndex]) {
            const taskNames = funcToUpdate.tasks.map(task => task.name);
            if (!taskNames.includes(payload.updates.name) || funcToUpdate.tasks[payload.taskIndex].name === payload.updates.name) {
              Object.assign(funcToUpdate.tasks[payload.taskIndex], payload.updates);
            } else {
              console.error('Task with the same name already exists.');
              toast.error('Task with the same name already exists.');
            }
          }
          break;
        case 'ADD_TASK':
          const funcToAddTask = state.functionalities.find(f => f.id === payload.functionalityId);
          if (funcToAddTask) {
            const taskNames = funcToAddTask.tasks.map(task => task.name);
            if (!taskNames.includes(payload.task.name)) {
              // Get the highest existing ID and add 1
              const nextId = funcToAddTask.tasks.length > 0 
                ? Math.max(...funcToAddTask.tasks.map(t => t.id)) + 1 
                : 0;
              
              funcToAddTask.tasks.push({
                ...payload.task,
                id: nextId,
                billed: true,
              });
            } else {
              console.error('Task with the same name already exists.');
              toast.error('Task with the same name already exists.');
            }
          }
          break;
        case 'REMOVE_TASK':
          const funcToRemoveTask = state.functionalities.find(f => f.id === payload.functionalityId);
          if (funcToRemoveTask) {
            funcToRemoveTask.tasks.splice(payload.taskIndex, 1);
          }
          break;
        case 'SET_TASKS_ORDER':
          const func = state.functionalities.find(f => f.id === payload.functionalityId);
          if (func) {
            func.tasks = payload.newTasks;
          }
          break;
        case 'CLONE_TASK':
          const funcWithTaskToClone = state.functionalities.find(f => f.id === payload.functionalityId);
          if (funcWithTaskToClone && funcWithTaskToClone.tasks[payload.taskIndex]) {
            const originalTask = funcWithTaskToClone.tasks[payload.taskIndex];
            
            // Get the highest existing task ID and add 1
            const nextId = funcWithTaskToClone.tasks.length > 0 
              ? Math.max(...funcWithTaskToClone.tasks.map(t => t.id)) + 1 
              : 0;
            
            // Create a cloned task with a new ID and modified name
            const clonedTask = {
              ...originalTask,
              id: nextId,
              name: `${originalTask.name} (Clone)`
            };
            
            // Insert the cloned task right after the original task
            funcWithTaskToClone.tasks.splice(payload.taskIndex + 1, 0, clonedTask);
          }
          break;
        case 'CLONE_FUNCTIONALITY':
          const functionalityToClone = state.functionalities.find(f => f.id === payload.functionalityId);
          if (functionalityToClone) {
            // Generate a new unique ID
            const newId = Math.max(...state.functionalities.map(f => Number(f.id))) + 1;
            
            // Deep clone the tasks to ensure we don't keep references
            const clonedTasks = functionalityToClone.tasks.map(task => ({
              ...task,
              id: task.id, // Keep original task IDs as they're scoped to the functionality
            }));
            
            // Create the cloned functionality
            const clonedFunctionality = {
              ...functionalityToClone,
              id: newId,
              name: `${functionalityToClone.name} (Clone)`,
              tasks: clonedTasks
            };
            
            // Find the index of the original functionality and insert the clone right after it
            const originalIndex = state.functionalities.findIndex(f => f.id === payload.functionalityId);
            state.functionalities.splice(originalIndex + 1, 0, clonedFunctionality);
          }
          break;
        default:
          break;
      }
    },
    loadAndSaveProjectFromLocalStorage: (state, action) => {
      const { type } = action.payload;
      
      if (type === 'import') {
        const savedProject = JSON.parse(localStorage.getItem('project'));
        if (savedProject) {
          try {
            state.functionalities = savedProject.functionalities;
            state.projectInfo = savedProject.projectInfo;
          } catch (error) {
            console.error('Error loading saved project:', error);
          }
        }
      } else if (type === 'save') {
        try {
          const projectToSave = {
            functionalities: state.functionalities,
            projectInfo: state.projectInfo,
          };
          localStorage.setItem('project', JSON.stringify(projectToSave));
        } catch (error) {
          console.error('Error saving project:', error);
        }
      }
    },
    deleteAll: (state) => {
      state = initialState;
      return state;
    },
    updateProjectInfo: (state, action) => {
      const { projectName, projectDescription, technologiesUsed, deliverables } = action.payload;
      if (projectName !== undefined) {
        state.projectInfo.projectName = projectName;
      }
      if (projectDescription !== undefined) {
        state.projectInfo.projectDescription = projectDescription;
      }
      if (technologiesUsed !== undefined) {
        state.projectInfo.technologiesUsed = technologiesUsed;
      }
      if (deliverables !== undefined) {
        state.projectInfo.deliverables = deliverables;
      }
    },
    setProjectState: (state, action) => {
      return action.payload;
    },
  },
});

export const { updateFunctionalities,  deleteAll, updateProjectInfo, setProjectState } = projectSlice.actions;
export default projectSlice.reducer;

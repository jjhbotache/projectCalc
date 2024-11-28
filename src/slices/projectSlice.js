import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

export const initialFunctionality = {
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
};

export const initialState = {
  functionalities: [
    initialFunctionality,    
  ],
  projectInfo:{
    projectName: 'My Project',
    projectDescription: '',
    technologiesUsed: [
      "example technology 1",
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
          console.log(
            'updating!');
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
              funcToAddTask.tasks.push({
                ...payload.task,
                billed: true, // Ensure billed defaults to true
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
      const { projectName, projectDescription, technologiesUsed } = action.payload;
      if (projectName !== undefined) {
        state.projectInfo.projectName = projectName;
      }
      if (projectDescription !== undefined) {
        state.projectInfo.projectDescription = projectDescription;
      }
      if (technologiesUsed !== undefined) {
        state.projectInfo.technologiesUsed = technologiesUsed;
      }
    },
  },
});

export const { updateFunctionalities, loadAndSaveProjectFromLocalStorage, deleteAll, updateProjectInfo } = projectSlice.actions;
export default projectSlice.reducer;

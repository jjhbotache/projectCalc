import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  settings: {
    hourlyRate: 10,
    hoursPerDay: 8,
  },
  functionalities: [
    {
      id: 1,
      name: 'Default Functionality',
      tasks: [
        {
          name: 'Default Task',
          hours: 0,
        },
      ],
      techCost: 0,
      laborCost: 0,
      duration: 0,
      monthlyCost: 0,
    },
  ],
};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    updateSettings: (state, action) => {
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload, // Handles all settings fields
        },
      };
    },
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
            Object.assign(funcToUpdate.tasks[payload.taskIndex], payload.updates);
          }
          break;
        case 'ADD_TASK':
          const funcToAddTask = state.functionalities.find(f => f.id === payload.functionalityId);
          if (funcToAddTask) {
            funcToAddTask.tasks.push(payload.task);
          }
          break;
        case 'REMOVE_TASK':
          const funcToRemoveTask = state.functionalities.find(f => f.id === payload.functionalityId);
          if (funcToRemoveTask) {
            funcToRemoveTask.tasks.splice(payload.taskIndex, 1);
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
            Object.assign(state.settings, savedProject.settings);
            state.functionalities = savedProject.functionalities;
          } catch (error) {
            console.error('Error loading saved project:', error);
          }
        }
      } else if (type === 'save') {
        try {
          const projectToSave = {
            settings: state.settings,
            functionalities: state.functionalities,
          };
          localStorage.setItem('project', JSON.stringify(projectToSave));
        } catch (error) {
          console.error('Error saving project:', error);
        }
      }
    }
  },
});

export const { updateSettings, updateFunctionalities, loadAndSaveProjectFromLocalStorage } = projectSlice.actions;
export default projectSlice.reducer;

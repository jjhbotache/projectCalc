import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  hourlyRate: 10,
  hoursPerDay: 8,
  workingDaysPerWeek: 5,
  technologiesKnown: [], // Array of { name: string, expertise: "beginner" | "intermediate" | "advanced" }
  geminiApiKey: '', // Add Gemini API key to initial state
  model: 'gemini-1.5-flash', // new property for selected model
};


const sliceInitialState = localStorage.getItem('config') != null 
  ? JSON.parse(localStorage.getItem('config'))
  : initialState;


const configSlice = createSlice({
  name: 'config',
  initialState:sliceInitialState,
  reducers: {
    updateConfig: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    loadAndSaveConfigFromLocalStorage: (state, action) => {
      const { type } = action.payload;
      if (type === 'import') {
        const savedConfig = JSON.parse(localStorage.getItem('config'));
        if (savedConfig) {
          Object.assign(state, savedConfig);
        }
      } else if (type === 'save') {
        localStorage.setItem('config', JSON.stringify(state));
      }
    },
    importConfig: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    exportConfig: (state) => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", "config.json");
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    },
  },
});

export const { updateConfig, loadAndSaveConfigFromLocalStorage, importConfig, exportConfig } = configSlice.actions;

// Add and export selector
export const selectConfig = (state) => state.config;

export default configSlice.reducer;

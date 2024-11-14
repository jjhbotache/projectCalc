import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  hourlyRate: 10,
  hoursPerDay: 8,
  workingDaysPerWeek: 5,
  technologiesKnown: [], // Array of { name: string, expertise: "beginner" | "intermediate" | "advanced" }
  geminiApiKey: '', // Add Gemini API key to initial state
};

const configSlice = createSlice({
  name: 'config',
  initialState,
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
  },
});

export const { updateConfig, loadAndSaveConfigFromLocalStorage } = configSlice.actions;

// Add and export selector
export const selectConfig = (state) => state.config;

export default configSlice.reducer;
